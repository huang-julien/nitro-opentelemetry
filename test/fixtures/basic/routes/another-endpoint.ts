export default defineTracedEventHandler((e) => {
    // @ts-expect-error internal API
    const parentSpanId = e.otel.span.parentSpanId
    return {
        traceId: e.otel.span.spanContext().traceId,
        parentSpanId,
    }
})