  import * as api from "@opentelemetry/api" 
 const context = api.context, trace = api.trace, propagation = api.propagation
export function defineEventHandlerWithTracing(handler: ReturnType<typeof defineEventHandler>) { 
    return defineEventHandler((event) => { 
        const output = {}
        const ctx = trace.setSpan(context.active(), event.context.span)
        const activeCtx = context.active(); 
        propagation.inject(context.active(), output) 

       return  context.with(ctx,  handler, undefined,  event) 
    })
}