import { context } from '@opentelemetry/api';
// @ts-ignore - alias
import renderer from "#nitro-renderer"
import { eventHandler } from "h3"

export default eventHandler((e) => {
    return context.with(e.otel.ctx, renderer, undefined, e)
})