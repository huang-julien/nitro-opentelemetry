import * as api from "@opentelemetry/api"
 import type { H3Event } from "h3";
import { ATTR_URL_PATH, ATTR_URL_FULL, ATTR_HTTP_REQUEST_METHOD, ATTR_HTTP_RESPONSE_STATUS_CODE, ATTR_URL_SCHEME, ATTR_SERVER_ADDRESS, ATTR_SERVER_PORT } from "@opentelemetry/semantic-conventions"
import type { NitroAppPlugin, NitroRuntimeHooks } from "nitropack";
import { getResponseStatus, getRequestProtocol, getRequestURL, getHeaders } from "h3"

const context = api.context, trace = api.trace 
export default <NitroAppPlugin>((nitro) => {
    const handler = nitro.h3App.handler

    nitro.h3App.handler = (event) => {
        return context.with(context.active(), handler, undefined, event  )
    }

    nitro.hooks.hook('request', async (event) => {
        const tracer = trace.getTracer('nitro-opentelemetry')
        const requestURL = getRequestURL(event)
        const currentContext = context.active() 

        // Extract the parent context from the headers if it exists
        // If a span is already set in the context, use it as the parent
        const parentCtx = trace.getSpan(currentContext) ? currentContext : api.propagation.extract(currentContext, getHeaders(event));
         const span = tracer.startSpan(await getSpanName(event), {
            attributes: {
                [ATTR_URL_PATH]: event.context.matchedRoute?.path || event.path,
                [ATTR_URL_FULL]: event.path,
                [ATTR_HTTP_REQUEST_METHOD]: event.method,
                [ATTR_URL_SCHEME]: getRequestProtocol(event),
                [ATTR_SERVER_ADDRESS]: requestURL.host,
                [ATTR_SERVER_PORT]: requestURL.port
            },
            kind: api.SpanKind.SERVER
        }, parentCtx)
        const ctx =  trace.setSpan(context.active(), span) 
        event.otel = {
            span,
            __endTime: undefined
            ,ctx
        } 
    })

    nitro.hooks.hook('beforeResponse', (event) => {
        event.otel.__endTime = Date.now()
    })

    nitro.hooks.hook('afterResponse', async (event) => {
        event.otel.span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, getResponseStatus(event))
        await nitro.hooks.callHook('otel:span:end', { event, span: event.otel.span })
        event.otel.span.end(event.otel.__endTime) 
    })

    nitro.hooks.hook('error', async (error, { event }) => {
        if (event) {
            event.otel.span.recordException(error)
            event.otel.span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, getResponseStatus(event))
            await nitro.hooks.callHook('otel:span:end', { event, span: event.otel.span })
            event.otel.span.end()
        } else {
            const span = trace.getSpan(api.ROOT_CONTEXT)
            span?.recordException(error)
            span?.end()
        }
    })

    async function getSpanName(event: H3Event) {
        const ctx: Parameters<NitroRuntimeHooks['otel:span:name']>[0] = { event, name: undefined }
        await nitro.hooks.callHook('otel:span:name', ctx)

        return ctx.name || (await nitro.h3App.resolve(event.path))?.route || event.path
    }
})

