import { describe, expect, it } from 'vitest'
import { $fetchRaw } from 'nitro-test-utils/e2e'
import { context, propagation, SpanKind, trace } from '@opentelemetry/api'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
const provider = new NodeTracerProvider();

provider.register();

describe('traces', async () => {
    it('should trace requests', async () => {
        const { data } = await $fetchRaw('')

        console.log(data)
        expect(data.traceId).toBeDefined()
    })

    it('should keep trace context', async () => {
        await trace.getTracer('test').startActiveSpan('test', {
            kind: SpanKind.CLIENT
        }, context.active(), async (span) => {
            const output = {};
            propagation.inject(context.active(), output);

            const { data } = await $fetchRaw('', {
                headers: {
                    ...output
                }
            })
            expect(data.traceId).toBe(span.spanContext().traceId)
        })
    })
})
