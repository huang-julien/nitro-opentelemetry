export default defineTracedEventHandler((e) => {
     const parentSpanId = e.otel.span.parentSpanContext.spanId
    console.log(e.otel.span)
    return {
        traceId: e.otel.span.spanContext().traceId,
        parentSpanId,
    }
})