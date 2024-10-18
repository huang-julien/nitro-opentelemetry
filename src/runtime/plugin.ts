import * as api from "@opentelemetry/api"
import { NitroApp } from "nitropack";
import type { H3Event } from "h3";
import { ATTR_URL_PATH, ATTR_URL_FULL } from "@opentelemetry/semantic-conventions"
import type { NitroAppPlugin, NitroRuntimeHooks } from "nitropack";
const context = api.context, trace = api.trace
const tracer = trace.getTracer('nitro-opentelemetry')

export default <NitroAppPlugin>((nitro) => {
    nitro.hooks.hook('request', async (event) => {
        const span = tracer.startSpan(await getSpanName(nitro, event), {
            attributes: {
                [ATTR_URL_PATH]: event.context.matchedRoute?.path || event.path,
                [ATTR_URL_FULL]: event.path
            },
            kind: api.SpanKind.SERVER
        }, context.active())
        trace.setSpan(context.active(), span)
        event.context.span = span
    })

    nitro.hooks.hook('beforeResponse', (event) => {
        event.context.span.end(new Date())
    })

    nitro.hooks.hook('afterResponse', (event) => {
        // @ts-ignore
        event.context.span = undefined
    })
})

async function getSpanName(nitro: NitroApp, event: H3Event) {
    const ctx: Parameters<NitroRuntimeHooks['nitro-opentelemetry:span-name']>[0] = { event, name: undefined }
    await nitro.hooks.callHook('nitro-opentelemetry:span-name', ctx)
    return ctx.name || event.context.matchedRoute?.path || event.path
}