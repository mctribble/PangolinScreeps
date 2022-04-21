import { BehaviorCollectEnergy, BehaviorHarvestEnergy, BehaviorHarvestToContainer } from "./HarvestBehaviors";
import { BehaviorUpgrade } from "./BehaviorUpgrade";
import { Log } from "utils/lib.log";

/**
 * attempts to cause a creep to behave according to its currently assigned goal
 * @returns true if there was a behavior to run, or false if there was not
 * @param creep unit to run behavior for
 */
export function runCreepBehavior(creep: Creep): boolean {
    if (creep.memory.goal) {
        delete creep.memory.idleSince; //creep is not idle if it is working on a goal
        runBehaviorByName(creep.memory.goal?.behaviorName, creep, creep.memory.goal?.goalArgs);
        return true;
    }

    return false;
}

/**
 * runs the behavior with the given name
 * @param {string} name name of the behavior
 * @param {Creep} creep creep to act
 * @param goalArgs arguments to pass to the goal
 */
export function runBehaviorByName(name: string, creep: Creep, goalArgs?: any): void {
    const nameMap: any =
    {
        // "BehaviorAttackController":             BehaviorAttackController,
        // "BehaviorAttackCreep":                  BehaviorAttackCreep,
        // "BehaviorClaimRoom":                    BehaviorClaimRoom,
        // "BehaviorCleanupDroppedResources":      BehaviorCleanupDroppedResources,
        "BehaviorCollectEnergy": BehaviorCollectEnergy,
        // "BehaviorCollectEnergyFromStorage":     BehaviorCollectEnergyFromStorage,
        // "BehaviorCollectEnergyFromTerminal":    BehaviorCollectEnergyFromTerminal,
        // "BehaviorCollectFromContainer":         BehaviorCollectFromContainer,
        // "BehaviorCollectFromLab":               BehaviorCollectFromLab,
        // "BehaviorConstruct":                    BehaviorConstruct,
        // "BehaviorGoToPosition":                 BehaviorGoToPosition,
        // "BehaviorGoToRoom":                     BehaviorGoToRoom,
        "BehaviorHarvestEnergy": BehaviorHarvestEnergy,
        "BehaviorHarvestToContainer": BehaviorHarvestToContainer,
        // "BehaviorMuster":                       BehaviorMuster,
        // "BehaviorRepair":                       BehaviorRepair,
        // "BehaviorSellResourceAtAnyPrice":       BehaviorSellResourceAtAnyPrice,
        // "BehaviorStoreResource":                BehaviorStoreResource,
        // "BehaviorSupplyLabWithMineral":         BehaviorSupplyLabWithMineral,
        // "BehaviorSupplySpawnOrExtension":       BehaviorSupplySpawnOrExtension,
        // "BehaviorSupplyStructure":              BehaviorSupplyStructure,
        // "BehaviorSupplyTerminal":               BehaviorSupplyTerminal,
        // "BehaviorTransferResourceToRoom":       BehaviorTransferResourceToRoom,
        // "BehaviorTransportMinerals":            BehaviorTransportMinerals,
        // "BehaviorTransportEnergy":              BehaviorTransportEnergy,
        "BehaviorUpgrade": BehaviorUpgrade,
    };

    const behavior: Behavior = <Behavior>nameMap[name];
    if (behavior) {
        if (!creep.spawning) //don't ask creeps to do things if they dont exist yet
        {
            behavior.run(creep, goalArgs);
        }
    }
    else {
        Log.error("SPAWNING", Game.time + "[" + creep.room.name + "][ERROR]: could not find behavior " + name + ".  Removing malformed goal on creep " + creep.name);
        delete creep.memory.goal;
    }
}
