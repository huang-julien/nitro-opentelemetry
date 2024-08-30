
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter,  } from '@opentelemetry/sdk-trace-node';
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { trace } from "@opentelemetry/api"  
import { randomUUID } from 'node:crypto'; 
import {
  SEMATTRS_CODE_FILEPATH,
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';


export default defineNitroPlugin((nitro) => {
 
  // For troubleshooting, set the log level to DiagLogLevel.DEBUG
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
   const sdk = new NodeSDK({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'yourServiceName',
      [SEMRESATTRS_SERVICE_VERSION]: '1.0',
    }),
    traceExporter: new ConsoleSpanExporter(),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new ConsoleMetricExporter(),
    }), 

  });
  
  sdk.start();
  // what the plugin should do 
  const tracer = trace.getTracer('nitro-opentelemetry');
  nitro.hooks.hook('request', (event) => {
    event.context.spanId = randomUUID() 
    event.context.span = tracer.startSpan('request-' + randomUUID())
    event.context.span.setAttribute(SEMATTRS_CODE_FILEPATH, 'nitro-opentelemetry/plugin.ts');
    event.context.span.addEvent('request-started');
    tracer.startSpan('request-' + randomUUID()).end()

  })

  nitro.hooks.hook('error', (error, {event}) => {
    if(event.context.spanId) {
      const span =event.context.span; 
      span.end()
    }
  })

  nitro.hooks.hook('afterResponse', (event) => { 
    if(event.context.spanId) {
  
      const span =event.context.span;
       span.end()
    }
  })
})