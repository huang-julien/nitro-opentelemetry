import { SpanKind, trace } from "@opentelemetry/api"  
 import type { NitroAppPlugin } from 'nitropack'
import { ATTR_HTTP_REQUEST_METHOD, ATTR_HTTP_RESPONSE_STATUS_CODE, ATTR_HTTP_ROUTE, ATTR_URL_FULL } from "@opentelemetry/semantic-conventions"
import { getResponseStatus } from "h3"

export default <NitroAppPlugin>((nitro) => {
  const tracer = trace.getTracer('nitro-opentelemetry');
  nitro.hooks.hook('request', (event) => {
    event.context.span = tracer.startSpan(event.context.matchedRoute?.path ?? event.path, {
      kind: SpanKind.SERVER,
      attributes: {
        [ATTR_HTTP_REQUEST_METHOD]: event.method,
        [ATTR_HTTP_ROUTE]: event.context.matchedRoute?.path ?? event.path,
        [ATTR_URL_FULL]: event.path
      }
    })
  })

  nitro.hooks.hook('error', (error, {event}) => {
    if(event?.context.span) {
      const span = event.context.span; 
      span.end()
    }
  })

  nitro.hooks.hook('beforeResponse', (event) => { 
    if(event.context.span) {
      const span = event.context.span;
      span.setAttributes({
        [ATTR_HTTP_RESPONSE_STATUS_CODE]: getResponseStatus(event),
      })
       span.end()
    }
  })
})