import type { TraceConfig } from "@microlabs/otel-cf-workers"

export interface CustomPreset {
    name: 'custom'
    filePath: string
}

export interface NodePreset {
    name: 'node'
}

export interface AzureMonitorPreset {
    name: 'azure-monitor'
}

export interface BaselimeNodePreset {
    name: 'baselime-node'
}
 
export interface BaselimeCfWorkerPreset {
    name: 'baselime-cf-worker'
    /**
     * This only accept serializable objects
     */
    options: TraceConfig
}

export type Presets = NodePreset | AzureMonitorPreset | BaselimeNodePreset | BaselimeCfWorkerPreset | CustomPreset
