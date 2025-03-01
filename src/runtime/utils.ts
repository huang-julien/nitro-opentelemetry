import type { EventHandlerRequest, EventHandlerResponse, EventHandler } from "h3";
import * as api from "@opentelemetry/api" 
import { defineEventHandler } from "h3";

const context = api.context

export function defineTracedEventHandler<
  Request extends EventHandlerRequest = EventHandlerRequest,
  Response = EventHandlerResponse,
>(handler: EventHandler<Request, Response>) {
  return defineEventHandler<Request, Response>((event) => {
    return context.with(event.otel.ctx, handler, undefined,  event) 
  })
}
