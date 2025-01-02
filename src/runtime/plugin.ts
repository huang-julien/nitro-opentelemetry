import * as api from "@opentelemetry/api"
import { NitroApp } from "nitropack";
import type { H3Event } from "h3";
import { ATTR_URL_PATH, ATTR_URL_FULL, ATTR_HTTP_REQUEST_METHOD, ATTR_HTTP_RESPONSE_STATUS_CODE, ATTR_URL_SCHEME, ATTR_SERVER_ADDRESS, ATTR_SERVER_PORT } from "@opentelemetry/semantic-conventions"
import type { NitroAppPlugin, NitroRuntimeHooks } from "nitropack";
import { getResponseStatus, getRequestProtocol, getRequestURL, getHeaders } from "h3"

const context = api.context, trace = api.trace
const tracer = trace.getTracer('nitro-opentelemetry')

export default <NitroAppPlugin>((nitro) => {
    nitro.hooks.hook('request', async (event) => {
        const requestURL = getRequestURL(event)
        const remoteCtx = api.propagation.extract(api.ROOT_CONTEXT, getHeaders(event))
        const span = tracer.startSpan(await getSpanName(nitro, event), {
            attributes: {
                [ATTR_URL_PATH]: event.context.matchedRoute?.path || event.path,
                [ATTR_URL_FULL]: event.path,
                [ATTR_HTTP_REQUEST_METHOD]: event.method,
                [ATTR_URL_SCHEME]: getRequestProtocol(event),
                [ATTR_SERVER_ADDRESS]: requestURL.host,
                [ATTR_SERVER_PORT]: requestURL.port
            },
            kind: api.SpanKind.SERVER
        }, remoteCtx)
        trace.setSpan(context.active(), span)
        event.context.span = span
    })

    nitro.hooks.hook('beforeResponse', (event) => {
        event.context.span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, getResponseStatus(event))
        event.context.span.end()
    })

    nitro.hooks.hook('error', (error, { event }) => {
        if (event) {
            event.context.span.recordException(error)
        } else {
            trace.getSpan(api.ROOT_CONTEXT)?.recordException(error)
        }
    })
})

async function getSpanName(nitro: NitroApp, event: H3Event) {
    const ctx: Parameters<NitroRuntimeHooks['otel:span:name']>[0] = { event, name: undefined }
    await nitro.hooks.callHook('otel:span:name', ctx)
    return ctx.name || event.context.matchedRoute?.path || event.path
}