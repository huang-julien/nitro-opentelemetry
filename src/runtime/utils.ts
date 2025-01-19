import { defineEventHandler } from "h3";

/**
 * @deprecated since 0.7.1. Use `defineEventHandler` instead.
 */
export function defineTracedEventHandler(handler: ReturnType<typeof defineEventHandler>) { 
    return defineEventHandler(handler)
}