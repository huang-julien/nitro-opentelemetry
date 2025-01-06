import { defineEventHandler } from "h3";

export default defineTracedEventHandler(async (e) => {
    const { traceId, parentSpanId } = await $fetch('/another-endpoint')
    return {
        traceId: e.context.span.spanContext().traceId,
        spanId: e.context.span.spanContext().spanId,
        anotherEndpoint: {
            traceId,
            parentSpanId
        }
    }
})