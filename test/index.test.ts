import { describe, expect, it } from 'vitest'
import { $fetchRaw } from 'nitro-test-utils/e2e'
const dummyTrace = '00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01'


describe('traces', async () => {
    it('should trace requests', async () => {
        const { data } = await $fetchRaw('/')

        expect(data.traceId).toBeDefined()
    })

    it('should keep trace context', async () => {
        const { data } = await $fetchRaw('/', {
            headers: {
                traceparent: dummyTrace
            }
        })
        // assert that the traceId is the same
        expect(data.traceId).toBe(dummyTrace.split('-')[1])

        // assert that localFetch is correctly traced
        expect(data.anotherEndpoint.traceId).toBe(data.traceId)
        expect(data.anotherEndpoint.parentSpanId).toBe(data.spanId)

    })

    it('event.$fetch', async () => {
        const { data } = await $fetchRaw('event-fetch', {
            headers: {
                traceparent: dummyTrace
            }
        })
        // assert that the traceId is the same
        expect(data.traceId).toBe(dummyTrace.split('-')[1])

        // assert that localFetch is correctly traced
        expect(data.anotherEndpoint.traceId).toBe(data.traceId)
        expect(data.anotherEndpoint.parentSpanId).toBe(data.spanId)
    })

})

describe('names', () => {
    it('should name span with dynamic path', async () => {
        const { data } = await $fetchRaw('/dynamic/test')

        expect(data).toBe('/dynamic/:slug')
    })
})
