
import { NodeSDK, } from '@opentelemetry/sdk-node';
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter, 
} from '@opentelemetry/sdk-metrics';
import { diag, DiagConsoleLogger, DiagLogLevel, SpanKind  } from '@opentelemetry/api';
import { trace, metrics, } from "@opentelemetry/api"  
import { randomUUID } from 'node:crypto'; 
import {
  SEMATTRS_HTTP_METHOD,
  SEMATTRS_HTTP_ROUTE,
  SEMATTRS_HTTP_URL,
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { AzureMonitorTraceExporter, AzureMonitorMetricExporter, AzureMonitorLogExporter  } from "@azure/monitor-opentelemetry-exporter"
import { useRuntimeConfig } from '#imports';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { MeterProvider } from "@opentelemetry/sdk-metrics"
import{ SimpleLogRecordProcessor,LoggerProvider,BatchLogRecordProcessor  } from '@opentelemetry/sdk-logs'
import { logs } from '@opentelemetry/api-logs';


export default defineNitroPlugin((nitro) => {
  const runtimeConfig = useRuntimeConfig()
  const exporter = new AzureMonitorTraceExporter({
    connectionString: 'InstrumentationKey=f629321d-170e-4630-85d3-09908821ab5a;IngestionEndpoint=https://francecentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://francecentral.livediagnostics.monitor.azure.com/;ApplicationId=e970c659-1858-4040-b255-aac514ea70e8'
  })
  const meterProvider  = new MeterProvider()
  const metric = new PeriodicExportingMetricReader({
    exporter: new AzureMonitorMetricExporter({
      connectionString: 'InstrumentationKey=f629321d-170e-4630-85d3-09908821ab5a;IngestionEndpoint=https://francecentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://francecentral.livediagnostics.monitor.azure.com/;ApplicationId=e970c659-1858-4040-b255-aac514ea70e8'
    }),
    exportIntervalMillis: 500,
  })
  const resource=  new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'yourServiceName',
    [SEMRESATTRS_SERVICE_VERSION]: '1.0',
  })
  const loggerProvider = new LoggerProvider({
    resource
  })


  
  const reqMetrics = metrics.getMeter('request')
  
  const reqCounter = reqMetrics.createCounter('request_count', )
  const logExporter = new AzureMonitorLogExporter({
    connectionString: 'InstrumentationKey=f629321d-170e-4630-85d3-09908821ab5a;IngestionEndpoint=https://francecentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://francecentral.livediagnostics.monitor.azure.com/;ApplicationId=e970c659-1858-4040-b255-aac514ea70e8'
  })
  
const logRecordProcessor = new BatchLogRecordProcessor(logExporter);
loggerProvider.addLogRecordProcessor(logRecordProcessor);
   // For troubleshooting, set the log level to DiagLogLevel.DEBUG
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
   const sdk = new NodeSDK({
    resource ,
    traceExporter: exporter,
    // spanProcessors: [new BatchSpanProcessor(exporter)],
    metricReader: metric,
    logRecordProcessor:  new SimpleLogRecordProcessor(logExporter),
  });

  logs.setGlobalLoggerProvider(loggerProvider)
  
  metrics.setGlobalMeterProvider(meterProvider)

  sdk.start();
  const tracer = trace.getTracer('nitro-opentelemetry');
  nitro.hooks.hook('request', (event) => { 
    reqCounter.add(1)
    const span = tracer.startSpan('request-' + randomUUID(), {
      kind: SpanKind.SERVER,
      startTime: new Date()
    })
    event.context.span = span
    
    span.setAttribute(SEMATTRS_HTTP_METHOD, event.method)
    span.updateName(event.path)
    span.setAttribute(SEMATTRS_HTTP_ROUTE, event.path)
    span.setAttribute(SEMATTRS_HTTP_URL, event.path)

  })

  nitro.hooks.hook('error', (error, {event}) => {
    if(event.context.span) {
      const span = event.context.span; 

      span.end(new Date())
    }
  })

  nitro.hooks.hook('afterResponse', (event) => { 
    if(event.context.span) {
  metric.collect()
      const span =event.context.span;
      span.end(new Date())
    }
  })

  process.on('exit', () => {
    sdk.shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });
})