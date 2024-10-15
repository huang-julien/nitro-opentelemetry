import * as api from "@opentelemetry/api" 
const context = api.context, trace = api.trace
import { NitroApp } from "nitropack";
import { H3Event } from "h3";
import { ATTR_URL_PATH, ATTR_URL_FULL } from "@opentelemetry/semantic-conventions"
import { contextManager } from "~/utils/context";
contextManager.enable(); 
context.setGlobalContextManager(contextManager)
const tracer = trace.getTracer('nitro-opentelemetry')

export default defineNitroPlugin((nitro) => {
     nitro.hooks.hook('request', async  (event) => {
         const span = tracer.startSpan(await getSpanName(nitro, event), {
            attributes: {
                [ATTR_URL_PATH]: event.context.matchedRoute?.path || event.path,
                [ATTR_URL_FULL]: event.path
            }
        }, context.active())
        

        event.context.span = span
    })

    nitro.hooks.hook('beforeResponse', (event) => {
        event.context.span.end()
    })

    nitro.hooks.hook('afterResponse', (event) => {
        delete event.context.otelCtx
        delete event.context.span
    })
})

async function getSpanName(nitro: NitroApp, event: H3Event) {
    return await nitro.hooks.callHook('nitro-opentelemetry:spanName', event) || event.context.matchedRoute?.path || event.path
}