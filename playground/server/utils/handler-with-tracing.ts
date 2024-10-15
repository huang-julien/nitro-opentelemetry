 import { contextManager } from "./context"
 import * as api from "@opentelemetry/api" 
 const context = api.context, trace = api.trace, propagation = api.propagation
export function defineEventHandlerWithTracing(handler: ReturnType<typeof defineEventHandler>) { 
    return defineEventHandler((event) => { 
    
        propagation.inject(context.active(), { 
            tracestate: event.context.span.spanContext().traceState
        })
 
       return  contextManager.with(trace.setSpan(context.active(), event.context.span),  handler, undefined,  event) 
    })
}