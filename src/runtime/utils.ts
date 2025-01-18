import * as api from "@opentelemetry/api" 
import { defineEventHandler } from "h3";

const context = api.context

export function defineTracedEventHandler(handler: ReturnType<typeof defineEventHandler>) { 
    return defineEventHandler((event) => { 
       return  context.with(event.otel.ctx, handler, undefined,  event) 
    })
}