import { trace } from "@opentelemetry/api"  
 import type { NitroAppPlugin } from 'nitropack'

export default <NitroAppPlugin>((nitro) => {
  const tracer = trace.getTracer('nitro-opentelemetry');
  nitro.hooks.hook('request', (event) => {
    event.context.span = tracer.startSpan(event.context.matchedRoute?.path ?? event.path) 
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
       span.end()
    }
  })
})