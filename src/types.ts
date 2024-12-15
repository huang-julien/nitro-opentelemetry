interface CustomPreset {
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
}

export type Presets = NodePreset | AzureMonitorPreset | BaselimeNodePreset | BaselimeCfWorkerPreset | CustomPreset
