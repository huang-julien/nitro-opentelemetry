import { useAzureMonitor, AzureMonitorOpenTelemetryOptions } from "@azure/monitor-opentelemetry";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
// @ts-ignore virtual
import _options from "#nitro-otel-options"
import { defu } from 'defu'

const options: AzureMonitorOpenTelemetryOptions = {
  azureMonitorExporterOptions: defu(_options as AzureMonitorOpenTelemetryOptions, {
    connectionString:
      process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"],
  }) 
}

registerInstrumentations({
    instrumentations: [
        new UndiciInstrumentation()
    ]
})

useAzureMonitor(options);
