import type { AzureMonitorOpenTelemetryOptions } from "@azure/monitor-opentelemetry"
import type { TraceConfig } from "@microlabs/otel-cf-workers"

export interface CustomPreset {
    name: 'custom'
    /**
     * The path to the initializer file.
     * This file will be imported in the entry file and need to initialize the OpenTelemetry SDK or one of its providers.
     */
    filePath: string
}

export interface NodePreset {
    name: 'node'
}

export interface AzureMonitorPreset {
    name: 'azure-monitor'
    options: AzureMonitorOpenTelemetryOptions
}

/**
 * Cloudflare Worker preset
 * uses @microlabs/otel-cf-workers under the hood and re-export the entry file
 */
export interface CfWorkerPreset {
    name: 'cf-worker'
    /**
     * The options to pass to the @microlabs/otel-cf-workers
     * This only accept serializable objects
     */
    options: TraceConfig
}

export type Presets = NodePreset | AzureMonitorPreset | CustomPreset | CfWorkerPreset
