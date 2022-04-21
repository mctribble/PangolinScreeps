/**
 * harvests energy directly from a source and does nothing special with it
 */
import { BehaviorStoreResource } from "./BehaviorStoreResource";
import { moveToOptions } from "../utils/lib.creep";
import { roomContainersAndStorage, idlePos } from "../utils/lib.room";
import { behaviorLog, globalLog } from "../utils/lib.log";

/**
 * collects energy from any available source
 */
export const BehaviorCollectEnergy =
{
    name: "BehaviorCollectEnergy",
    run(creep: Creep) {
        //even if the creep was previously sharing, the fact we made it here suggests they no longer should
        creep.memory.isWillingToShareEnergy = false;

        if (!creep.memory.goal!.behaviorMemory)
            creep.memory.goal!.behaviorMemory = {};

        let targetId = (creep.memory.goal!.behaviorMemory && creep.memory.goal!.behaviorMemory.targetId);

        //before doing the main target evaluation, we want to do a special case of immediately cleaning up dropped energy
        //because otherwise it is wasted
        if (!targetId) {
            const possibleTargets = creep.room.find(FIND_DROPPED_RESOURCES, { filter: resource => resource.resourceType === RESOURCE_ENERGY });
            if (possibleTargets && possibleTargets.length > 0) {
                targetId = (creep.pos.findClosestByPath(possibleTargets) || { id: null }).id;
            }
        }

        if (!targetId) {
            //build a list of possible targets
            const possibleTargets: { id: string, pos: RoomPosition }[] = [];

            //tombstones that have energy
            possibleTargets.push(...creep.room.find(FIND_TOMBSTONES, { filter: t => t.store.energy > 0 }));

            //containers and storage structures that have energy, and are at or above 80% capacity
            if (possibleTargets.length === 0)
                possibleTargets.push(...creep.room.find(FIND_STRUCTURES, {
                    filter: s => {
                        return (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) &&
                            s.store.energy > 0 && (_.sum(s.store.) <= (s.storeCapacity * 0.8))
                    }
                }));

            //containers and storage structures that have energy, but are not full.  Prefer above targets over this
            if (possibleTargets.length === 0)
                possibleTargets.push(...creep.room.find(FIND_STRUCTURES, {
                    filter: s => {
                        return (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) &&
                            s.store.energy > 0
                    }
                }));

            //creeps that have energy and are willing to share it.  Prefer above targets over this
            if (possibleTargets.length === 0)
                possibleTargets.push(...creep.room.find(FIND_MY_CREEPS, {
                    filter: c => {
                        return c.carry.energy && c.memory.isWillingToShareEnergy;
                    }
                }));

            //only consider sources if nothing else is available and this creep has at least one WORK part
            if (possibleTargets.length === 0 && creep.getActiveBodyparts(WORK))
                possibleTargets.push(...creep.room.find(FIND_SOURCES_ACTIVE));

            //target the closest available source
            const closestTarget = creep.pos.findClosestByPath(possibleTargets);

            //if no valid targets, wait at idle pos
            if (!closestTarget) {
                creep.moveTo(idlePos(creep.room), moveToOptions(this));
                return;
            }

            targetId = closestTarget.id;
            creep.memory.goal!.behaviorMemory.targetId = targetId;
        }

        const targetObject = Game.getObjectById(targetId) as _HasRoomPosition;
        if (!targetObject) {
            //target object went away.  reset.
            delete creep.memory.goal!.behaviorMemory.targetId;
            return;
        }

        //if target is another creep, ask it to transfer its energy to us
        const targetCreep = <Creep>targetObject;
        if (targetCreep && targetCreep.name && targetCreep.transfer) //TODO: this was throwing "targetCreep.transfer is not a function".  Figure out why and give it a proper fix.
        {
            globalLog(LogType.trace, "targetCreep: " + targetCreep);
            switch (targetCreep.transfer(creep, "energy")) {
                //target no longer has energy; find another source
                case ERR_NOT_ENOUGH_RESOURCES:
                    delete creep.memory.goal!.behaviorMemory.targetId;
                    return;

                //collected successfully.  If we are full, then complete the goal.  Otherwise, continue look for another source
                case OK:
                    if (_.sum(creep.carry) === creep.carryCapacity)
                        delete creep.memory.goal;
                    else
                        delete creep.memory.goal!.behaviorMemory;

                    return;

                //we need to get closer first
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(targetCreep, moveToOptions(this));
                    return;

                //we are already full.  stop trying to collect energy.
                case ERR_FULL:
                    delete creep.memory.goal;
                    return;

                default:
                    behaviorLog(creep.room.name, LogType.error, this, "Unhandled creep.transfer result!");
            }
        }

        //if target is a resource pile, pick it up
        const targetResourcePile = <Resource>targetObject;
        if (targetResourcePile && targetResourcePile.resourceType == RESOURCE_ENERGY) {
            globalLog(LogType.trace, "targetResourcePile: " + targetResourcePile);
            const result = creep.pickup(targetResourcePile);
            switch (result) {
                case OK:
                case ERR_FULL:
                    delete creep.memory.goal;
                    return;
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(targetResourcePile, moveToOptions(this));
                    return;
                case ERR_INVALID_TARGET:
                    delete creep.memory.goal!.behaviorMemory.targetId;
                    behaviorLog(creep.room.name, LogType.warning, this, "invalid pickup target was removed: " + targetId);
                    return;
                default: behaviorLog(creep.room.name, LogType.error, this, "Unhandled pickup result: " + result);
            }
        }

        //if target is an energy source, harvest from it
        const targetSource = <Source>targetObject;
        if (targetSource /*&& targetSource.ticksToRegeneration */) {
            globalLog(LogType.trace, "targetSource: " + targetSource);
            const harvestResult = creep.harvest(targetSource);
            switch (harvestResult) {
                //source is no longer active; find another source
                case ERR_NOT_ENOUGH_RESOURCES:
                    delete creep.memory.goal!.behaviorMemory.targetId;
                    return;

                //harvested successfully.  If we are full, then complete the goal.  Otherwise, continue harvesting
                case OK:
                    if (_.sum(creep.carry) === creep.carryCapacity)
                        delete creep.memory.goal;

                    return;

                //we need to get closer first
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(targetSource, moveToOptions(this));
                    return;

                case ERR_NO_BODYPART:
                    behaviorLog(creep.room.name, LogType.warning, this, "Creep failed to harvest from an energy source because it has no WORK part.");
                    delete creep.memory.goal!.behaviorMemory.targetId;
                    return;

                default:
                    behaviorLog(creep.room.name, LogType.error, this, "Unhandled response from creep.harvest()! (" + harvestResult + ")     ");
                    return;

                case ERR_INVALID_TARGET:
                    behaviorLog(creep.room.name, LogType.error, this, "creep.harvest() illegal argument: " + JSON.stringify(targetSource));
                    break;
            }
        }

        //target is not a source, so we want to withdraw from it
        globalLog(LogType.trace, "targetObject: " + JSON.stringify(targetObject));
        switch (creep.withdraw(targetObject as Structure | Tombstone, RESOURCE_ENERGY)) {
            //target is no longer active; find another source
            case ERR_NOT_ENOUGH_RESOURCES:
                delete creep.memory.goal!.behaviorMemory.targetId;
                return;

            //harvested successfully.  If we are full, then complete the goal.  Otherwise, continue harvesting
            case OK:
                if (_.sum(creep.carry) === creep.carryCapacity)
                    delete creep.memory.goal;

                return;

            //we need to get closer first
            case ERR_NOT_IN_RANGE:
                creep.moveTo(targetObject, moveToOptions(this));
                return;
        }

        //if we are full, this goal is complete
        if (_.sum(creep.carry) === creep.carryCapacity)
            delete creep.memory.goal;
    }
};

/**
 * this harvest goal is intended for DEDICATED harvesters, and thus the goal will not delete itself when the creep is not working
 * However, if the creep is idle for an extended period, it will go upgrade the controller as a fallback
 */
export const BehaviorHarvestEnergy: Behavior =
{
    name: "BehaviorHarvestEnergy",
    run(creep: Creep, targetSourceId?: string) {
        if (!creep.memory.goal!.behaviorMemory)
            creep.memory.goal!.behaviorMemory = {};
        else if (creep.memory.goal!.behaviorMemory.upgrading) {
            creep.memory.goal!.behaviorMemory.upgrading = upgradeControllerFallback(creep);
            return;
        }

        //harvesters are willing to share what they are holding
        creep.memory.isWillingToShareEnergy = true;

        let targetSource: Source | null = null;
        if (targetSourceId)
            targetSource = <Source>Game.getObjectById(targetSourceId);
        else {
            behaviorLog(creep.room.name, LogType.error, this, "cannot find target source " + targetSourceId);
        }

        if (!targetSource)
            return;

        if (_.sum(creep.carry) < creep.carryCapacity) {
            const harvestResult = creep.harvest(targetSource);
            switch (harvestResult) {
                case OK:
                    return;
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(targetSource, moveToOptions(this));
                    creep.memory.goal!.behaviorMemory.fullForTicks = 0;
                    return;
                default:
                    behaviorLog(creep.room.name, LogType.error, this, "unhandled harvest result! (" + harvestResult + ")");
            }
        }

        //attempt to store energy near the source
        const nearbyContainer = _.find(creep.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return (structure.structureType === STRUCTURE_STORAGE ||
                    structure.structureType === STRUCTURE_CONTAINER) &&
                    structure.pos.getRangeTo(targetSource!.pos) <= 3;
            }
        }));
        if (nearbyContainer) {
            switch (creep.transfer(nearbyContainer, "energy")) {
                case OK:
                    creep.memory.goal!.behaviorMemory.fullForTicks = 0;
                    return;
                case ERR_FULL:
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.memory.goal!.behaviorMemory.fullForTicks = 0;
                    creep.moveTo(nearbyContainer);
                    return;
                default: behaviorLog(creep.room.name, LogType.error, this, "Unhandled transfer result!");
            }
        }

        //nowhere to store the energy.  If such a place is being constructed, assist in its construction
        const nearbyContainerConstructionSite = _.find(creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: site => {
                return (site.structureType === STRUCTURE_STORAGE || site.structureType === STRUCTURE_CONTAINER) &&
                    site.pos.getRangeTo(targetSource!.pos) <= 3;
            }
        }));
        if (nearbyContainerConstructionSite) {
            const buildResult = creep.build(nearbyContainerConstructionSite);
            switch (buildResult) {
                case OK:
                case ERR_NOT_ENOUGH_ENERGY:
                    creep.memory.goal!.behaviorMemory.fullForTicks = 0;
                    return;
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(nearbyContainerConstructionSite);
                    creep.memory.goal!.behaviorMemory.fullForTicks = 0;
                    return;
                default: behaviorLog(creep.room.name, LogType.error, this, "Unhandled build result! (" + buildResult + ")   ");
            }
        }

        creep.memory.goal!.behaviorMemory.fullForTicks = (creep.memory.goal!.behaviorMemory.fullForTicks + 1) || 1;
        if (creep.memory.goal!.behaviorMemory.fullForTicks >= 25) {
            behaviorLog(creep.room.name, LogType.debugBehavior, this, "harvester has been full with nothing to do for 25 ticks.  Upgrading controller as a fallback.");
            creep.memory.goal!.behaviorMemory.upgrading = true;
        }
        else {
            behaviorLog(creep.room.name, LogType.debugBehavior, this, "harvester is full of energy and has nothing to do! (" +
                creep.memory.goal!.behaviorMemory.fullForTicks + "/25)");
        }
    }
};

/**
 * if another harvest task has been idle for an extended period, it might revert to upgrading the controller to make sure it can remain productive
 * this function is responsible for that.  It returns true until the creep runs out of energy, then returns false
 * @param creep
 */
function upgradeControllerFallback(creep: Creep): boolean {
    //cant upgrade a controller that isnt ours
    if (!creep.room.controller || !creep.room.controller.my)
        return false;

    switch (creep.upgradeController(creep.room.controller)) {
        case OK:
            creep.room.memory.statistics.upgradesThisTick++;
            return creep.carry.energy > 0;
        case ERR_NOT_ENOUGH_ENERGY:
        case ERR_INVALID_TARGET:
            return false;
        case ERR_NOT_IN_RANGE:
            creep.moveTo(creep.room.controller, moveToOptions(BehaviorHarvestEnergy, 3));
            return true;
        default:
            behaviorLog(creep.room.name, LogType.error, BehaviorHarvestEnergy, "unhandled result from upgradeControllerFallback upgrade call");
            return true;
    }
}

/**
 * harvests energy directly from a source and stores it in a container
 */
export const BehaviorHarvestToContainer: Behavior =
{
    name: "BehaviorHarvestToContainer",
    run(creep: Creep, targetSourceId?: string) {
        if (!creep.memory.goal!.behaviorMemory)
            creep.memory.goal!.behaviorMemory = { state: "HARVEST" };

        let targetSourceOrMineral = null;
        if (targetSourceId)
            targetSourceOrMineral = <Source | Mineral>Game.getObjectById(targetSourceId);
        else
            targetSourceOrMineral = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

        if (!targetSourceOrMineral) {
            console.log("[ERROR]: BehaviorHarvestEnergy can't find an active source");
            return;
        }

        if (creep.memory.goal!.behaviorMemory.state === "HARVEST") {
            if (_.sum(creep.carry) < creep.carryCapacity) {
                if (creep.harvest(targetSourceOrMineral) === ERR_NOT_IN_RANGE)
                    creep.moveTo(targetSourceOrMineral, moveToOptions(this));
            }
            else {
                creep.memory.goal!.behaviorMemory.state = "STORE";
            }
        }

        if (creep.memory.goal!.behaviorMemory.state === "STORE") {
            if (!creep.memory.goal!.behaviorMemory.targetContainer) {
                const targetContainer = creep.pos.findClosestByPath(roomContainersAndStorage(creep.room));
                if (targetContainer)
                    creep.memory.goal!.behaviorMemory.targetContainer = targetContainer.id;
                else {
                    console.log(Game.time + " [" + creep.room.name + "][WARN] tried to store energy in a container, but there is none!");
                    delete creep.memory.goal;
                    return;
                }
            }

            return BehaviorStoreResource.run(creep, creep.memory.goal!.behaviorMemory.targetContainer);
        }
    }
};
