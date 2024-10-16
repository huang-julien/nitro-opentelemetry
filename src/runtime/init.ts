import  { registerInstrumentations } from '@opentelemetry/instrumentation'
import  { ConsoleSpanExporter, NodeTracerProvider, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import * as api from '@opentelemetry/api';
const context = api.context, diag = api.diag, DiagConsoleLogger = api.DiagConsoleLogger, DiagLogLevel = api.DiagConsoleLogger;
export const contextManager = new AsyncLocalStorageContextManager();
 diag.setLogger(new DiagConsoleLogger(), {
    logLevel: DiagLogLevel.DEBUG
 });
// Create and configure NodeTracerProvider
const provider = new NodeTracerProvider();
console.log('registering')
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

// Initialize the provider
provider.register({
    contextManager,

});


// register and load instrumentation and old plugins - old plugins will be loaded automatically as previously
// but instrumentations needs to be added
registerInstrumentations({
    instrumentations: [
        
        new HttpInstrumentation({
            requestHook: (span, request) => {
              console.log('http Instrumentation', request)
              span.setAttribute("custom request hook attribute", "request");
            }
          }),
          new UndiciInstrumentation({
            requestHook: (span, request) => {
              console.log('undici instrumentation', request)
              span.setAttribute("custom request hook attribute", "request");
            },
          })

    ],
});