export default defineTracedEventHandler((e) => {
    // @ts-expect-error internal API
    const parentSpanId = e.context.span.parentSpanId
    return {
        traceId: e.context.span.spanContext().traceId,parentSpanId,
    }
})