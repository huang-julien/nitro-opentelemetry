export default defineTracedEventHandler({
  handler: async (e) => {
    const { traceId, parentSpanId } =
      await globalThis.$fetch('/another-endpoint');
    return {
      traceId: e.otel.span.spanContext().traceId,
      spanId: e.otel.span.spanContext().spanId,
      anotherEndpoint: {
        traceId,
        parentSpanId,
      },
    };
  },
});
