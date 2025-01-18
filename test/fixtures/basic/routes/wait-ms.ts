
export default defineTracedEventHandler(async (e) => {
    const ms = Number(getQuery(e).ms)
    
    await new Promise((resolve) => setTimeout(resolve, ms))
    const { traceId, parentSpanId } = await globalThis.$fetch('/another-endpoint')
    return {
        traceId: e.otel.span.spanContext().traceId,
        spanId: e.otel.span.spanContext().spanId,
        anotherEndpoint: {
            traceId,
            parentSpanId
        }
    }
})