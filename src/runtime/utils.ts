import type {
  EventHandlerRequest,
  EventHandlerResponse,
  EventHandler,
  EventHandlerObject,
} from "h3"
import * as api from "@opentelemetry/api"
import { defineEventHandler } from "h3"
import { CachedEventHandlerOptions, } from "nitropack/types"
import { defineCachedEventHandler } from "nitropack/runtime/cache"
const context = api.context

export function defineTracedEventHandler<
  Request extends EventHandlerRequest = EventHandlerRequest,
  Response = EventHandlerResponse,
>(handler: EventHandler<Request, Response> | EventHandlerObject<Request, Response>) {
  if (isEventHandler(handler)) {
    return defineEventHandler<Request, Response>((event) => {
      return context.with(event.otel.ctx, handler, undefined, event)
    })
  } else if (isEventHandlerObject(handler)) {
    const { handler: h, ...rest } = handler
    return defineEventHandler({
      ...rest,
      handler: (event) => {
        return context.with(event.otel.ctx, h, undefined, event)
      },
    })
  }
  throw new Error("Event handler must satisfy either EventHandler or EventHandlerObject from h3")
}

export function defineTracedCachedEventHander<
  Request extends EventHandlerRequest = EventHandlerRequest,
  Response = EventHandlerResponse,
>(
  handler: EventHandler<Request, Response>,
  opts: CachedEventHandlerOptions<Response>
): EventHandler<Request, Response> {
  return defineCachedEventHandler((event) => {
    return context.with(event.otel.ctx, handler, undefined, event)
  }, opts)
}

function isEventHandler<
  Request extends EventHandlerRequest = EventHandlerRequest,
  Response = EventHandlerResponse,
>(
  handler: EventHandler<Request, Response> | EventHandlerObject<Request, Response>,
): handler is EventHandler<Request, Response> {
  return typeof handler === "function"
}

function isEventHandlerObject<
  Request extends EventHandlerRequest = EventHandlerRequest,
  Response = EventHandlerResponse,
>(
  handler: EventHandler<Request, Response> | EventHandlerObject<Request, Response>,
): handler is EventHandlerObject<Request, Response> {
  return typeof handler === "object" && typeof handler.handler === "function"
}
