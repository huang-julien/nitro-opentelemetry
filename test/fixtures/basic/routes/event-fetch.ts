export default defineTracedEventHandler(async (e) => {
    const { traceId, parentSpanId } = await e.$fetch('/another-endpoint')
    return {
        traceId: e.otel.span.spanContext().traceId,
        spanId: e.otel.span.spanContext().spanId,
        anotherEndpoint: {
            traceId,
            parentSpanId
        },
        parentSpanId: e.otel.span.parentSpanContext.spanId
    }
})