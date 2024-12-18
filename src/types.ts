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

export interface BaselimeNodePreset {
    name: 'baselime-node'
}

/**
 * Baselime Cloudflare Worker preset
 * This preset is a wrapper around the @microlabs/otel-cf-workers
 */
export interface BaselimeCfWorkerPreset {
    name: 'baselime-cf-worker'
    /**
     * The options to pass to the @microlabs/otel-cf-workers
     * This only accept serializable objects
     */
    options: TraceConfig
}

export type Presets = NodePreset | AzureMonitorPreset | BaselimeNodePreset | BaselimeCfWorkerPreset | CustomPreset
