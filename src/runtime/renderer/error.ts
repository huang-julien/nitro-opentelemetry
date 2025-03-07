import { context } from "@opentelemetry/api";
import { NitroErrorHandler } from "nitropack";
// @ts-ignore - alias
import errorRenderer from "#nitro-error-handler";

export default <NitroErrorHandler>((error, event) => {
    return context.with(event.otel.ctx, errorRenderer, undefined, error, event)
})