// how global memory is structured
interface Memory {
    globalLogLevels?: Record<string, LogLevel>,
    globalSettings?: GlobalSettings,
    creeps: { [index: string]: CreepMemory },
    flags: { [index: string]: FlagMemory },
    rooms: { [index: string]: RoomMemory },
    spawns: { [index: string]: SpawnMemory },
}

/**
 * defines how room memory should be structured
 */
interface RoomMemory {
    logLevels?: Record<string, LogLevel>;
}

/**
 * defines how creep memory should be structured
 */
interface CreepMemory {

    //if true, this creep is specialized for a specific purpose
    //specialized creeps will be ignored when determining whether a room needs more units
    //and will not take part in general goal assignment
    //typically, such creeps are being controlled by a Role
    specialized: boolean,

    goal?: Goal, //goal this creep is currently working on
    idleSince?: number, //first tick this creep became idle
    isWillingToShareEnergy?: boolean, //if true, this creep is willing to share its energy with other creeps
}

interface GlobalSettings {
    //number of ticks to reuse any given path before calculating it again
    //lower values produce better movement, but have a severe performance impact
    moveToReusePathTicks?: number,
}

interface RoomSettingsForConstruction {
    forceTheseSettings: boolean, //if true, high level automation will never update these
    spawnExtensions: boolean,
    roadsBySpawnsAndExtensions: boolean,
    roadsByTowers: boolean,
    containersBySources: boolean,
    containersByExtractors: boolean,
    towers: boolean,
    extractors: boolean,
    storage: boolean,
}

interface RoomSettingsForSpawning {
    targetCreepCounts: CreepCounts,
}

interface RoomSettingsForRepairs {
    maxDefenseHealth: number,   //walls wont be repaired above this many hits
    wallRepairThreshold: number //if set, storage must contain at least this much energy for walls to be repaired
}
