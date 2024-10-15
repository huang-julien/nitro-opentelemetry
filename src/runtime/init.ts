import  { registerInstrumentations } from '@opentelemetry/instrumentation'
import  { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
// Create and configure NodeTracerProvider
const provider = new NodeTracerProvider();
console.log('registering')
// Initialize the provider
provider.register();

// register and load instrumentation and old plugins - old plugins will be loaded automatically as previously
// but instrumentations needs to be added
registerInstrumentations({
    instrumentations: [
        new HttpInstrumentation({
            requestHook: (span, request) => {
              span.setAttribute("custom request hook attribute", "request");
            },
        }),
    ]
});