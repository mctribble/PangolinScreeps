/**
 * specifies how a flag should behave, based on their colors
 * @type {({name: string; primary: 5; secondary: 9} | {name: string; primary: 5; secondary: 10} | {name: string; primary: 9; secondary: 10; order: FlagOrder})[]}
 */
export const flagSpecs: FlagSpec[] =
    [
        //harvester flags
        // {name:"HARVEST_GENERIC",      primary:COLOR_YELLOW, secondary:COLOR_GREY,   goalProvider:GoalProviderHarvestGeneric},
        // {name:"HARVEST_BASIC",        primary:COLOR_YELLOW, secondary:COLOR_YELLOW, goalProvider:GoalProviderHarvestBasic},
        // {name:"HARVEST_TO_CONTAINER", primary:COLOR_YELLOW, secondary:COLOR_GREEN,  goalProvider:GoalProviderHarvestToContainer},
        // {name:"HARVEST_REMOTE",       primary:COLOR_YELLOW, secondary:COLOR_ORANGE, order: FlagOrderHarvestRemote},

        //lab flags
        // {name:"LAB_SUPPLY_LOCAL",  primary:COLOR_PURPLE, secondary:COLOR_YELLOW, goalProvider:GoalProviderLabSupplyLocal},
        // {name:"LAB_SUPPLY_REMOTE", primary:COLOR_PURPLE, secondary:COLOR_ORANGE, goalProvider:GoalProviderLabSupplyLocal, order:FlagOrderSupplyLabRemote},
        // {name:"LAB_PRODUCE",       primary:COLOR_PURPLE, secondary:COLOR_BLUE,   goalProvider:GoalProviderCollectFromLab, order:FlagOrderLabProduce},
        // {name:"LAB_CLEANUP",       primary:COLOR_PURPLE, secondary:COLOR_GREY,   goalProvider:GoalProviderLabCleanup},

        //muster flags
        // {name:"MUSTER_CLAIMER",           primary:COLOR_ORANGE, secondary:COLOR_CYAN, goalProvider:GoalProviderMusterClaimer,          order:FlagOrderMusterClaimer},
        // {name:"MUSTER_RAIDING_PARTY",     primary:COLOR_ORANGE, secondary:COLOR_RED,  goalProvider:GoalProviderMusterRaidingParty,     order:FlagOrderMusterRaidingParty},
        // {name:"MUSTER_CONSTRUCTION_CREW", primary:COLOR_ORANGE, secondary:COLOR_BLUE, goalProvider:GoalProviderMusterConstructionCrew, order:FlagOrderMusterConstructionCrew},
        // {name:"MUSTER_IDLE",              primary:COLOR_ORANGE, secondary:COLOR_GREY}, //no goal provider: this is used as a marker for BehaviorIdle

        //construction flags
        // {name:"BUILD_SPAWN_HERE", primary:COLOR_BLUE, secondary:COLOR_RED, order:FlagOrderBuildSpawnHere},
        // {name:"REMOVE_ROOM_CONSTRUCTION_SITES", primary:COLOR_BLUE, secondary:COLOR_RED, order:FlagOrderRemoveRoomConstructionSites},

        //debug flags
        // {name:"DEBUG_REASSIGN_GOALS",              primary:COLOR_GREY, secondary:COLOR_WHITE,  order:FlagOrderDebugReassignGoals},
        // {name:"DEBUG_PURGE_CREEP_AND_FLAG_MEMORY", primary:COLOR_GREY, secondary:COLOR_RED,    order:FlagOrderDebugPurgeMemory},
        // {name:"DEBUG_PURGE_ROOM_SETTINGS",         primary:COLOR_GREY, secondary:COLOR_ORANGE, order:FlagOrderDebugPurgeRoomSettings},
        // {name:"DEBUG_RESET_LOGGING",               primary:COLOR_GREY, secondary:COLOR_GREY,   order:FlagOrderDebugResetLogging},
        // {name:"DEBUG_PURGE_ALL_ROOM_SETTINGS",     primary:COLOR_GREY, secondary:COLOR_PURPLE, order:FlagOrderDebugPurgeAllRoomSettings},
        // {name:"DEBUG_RESET_SPAWN_ADJUSTMENTS",     primary:COLOR_GREY, secondary:COLOR_BROWN,  order:FlagOrderDebugResetSpawnAdjustments},
    ];
