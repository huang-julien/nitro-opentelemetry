import { defineEventHandler } from "h3";

export default defineEventHandler((e) => {
    return {
        traceId: e.context.span.spanContext().traceId,
    }
})