import * as api from "@opentelemetry/api" 
import { defineEventHandler } from "h3";

const context = api.context, trace = api.trace

export function defineEventHandlerWithTracing(handler: ReturnType<typeof defineEventHandler>) { 
    return defineEventHandler((event) => { 
       return  context.with(trace.setSpan(context.active(), event.context.span),  handler, undefined,  event) 
    })
}