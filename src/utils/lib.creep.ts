/**
 * counts the number of creeps in the array and their composition
 * @pram {creeps} creeps to count
 * @returns {CreepCounts}
 */
export function countCreepsFromArray(creeps: Creep[]): CreepCounts {
    let count: CreepCounts = { creeps: 0, parts: [{ part: MOVE, count: 0 }] };

    creeps.forEach(creep => addCreepToCounts(count, creep));

    return count;
}

/**
 * counts the number of creeps in the room and their composition
 * @param {Room} room to count from
 * @param ignoreSpecialized if true, then creeps with the "specialized" flag set are ignored
 * @returns {CreepCounts}
 */
export function countCreeps(room: Room, ignoreSpecialized?: boolean): CreepCounts {
    const roomCreeps: Creep[] = room.find(FIND_MY_CREEPS);

    let count: CreepCounts = { creeps: 0, parts: [{ part: MOVE, count: 0 }] };

    roomCreeps.forEach(creep => {
        if (!(ignoreSpecialized && creep.memory.specialized))
            addCreepToCounts(count, creep);
    });

    return count;
}

/**
 * counts the number of creeps in the room working on a goal with the given name and target and their composition
 * @param {Room} room
 * @param {string} goalName
 * @param {string} targetId
 * @returns {number}
 */
export function countCreepsWithGoal(room: Room, goalName: string, targetId?: string): CreepCounts {
    const roomCreeps: Creep[] = room.find(FIND_MY_CREEPS);
    let count: CreepCounts = { creeps: 0, parts: [{ part: MOVE, count: 0 }] };

    roomCreeps.forEach(creep => {
        if (creep.memory.goal) {
            if (creep.memory.goal.name === goalName) {
                if (creep.memory.goal.goalArgs === targetId) {
                    addCreepToCounts(count, creep);
                }
            }
        }
    });

    return count;
}

/**
 * returns true if any value in b is larger than the corresponding value of a
 * @param {CreepCounts} a
 * @param {CreepCounts} b
 */
export function creepCountsLessThan(a: CreepCounts, b: CreepCounts) {
    //check creep counts
    if (a.creeps < b.creeps)
        return true;

    //check every part definition in b
    for (let i = 0; i < b.parts.length; i++) {
        const bPart = b.parts[i];
        const aPart = _.find(a.parts, ap => ap.part === bPart.part);

        if (!aPart || aPart.count < bPart.count)
            return true;
    }

    return false;
}

/**
 * adds the given creep to the CreepCounts object
 * @param {CreepCounts} count
 * @param {Creep} creep
 */
export function addCreepToCounts(count: CreepCounts, creep: Creep) {
    count.creeps++;
    creep.body.forEach(bodyPartDefinition => {
        let part = _.find(count.parts, p => p.part === bodyPartDefinition.type);

        if (part)
            part.count++;
        else
            count.parts.push({ part: bodyPartDefinition.type, count: 1 });
    });
}

/**
 * checks whether or not this creep meets all of the minimum requirements of the goal
 * @param {Creep} creep
 * @param goal
 */
export function isCreepQualified(creep: Creep, goal: Goal) {
    //minimum energy
    if (goal.minimumEnergy && goal.minimumEnergy > creep.store.energy)
        return false;

    //minimum capacity
    if (goal.minimumOpenCapacity && (goal.minimumOpenCapacity.amount > creep.store.getFreeCapacity(goal.minimumOpenCapacity.resource)))
        return false;

    //part requests
    for (let i = 0; i < goal.partsRequested.length; i++) {
        //count parts matching the request
        const partsMatchingRequest = creep.body.filter(bpd => bpd.type === goal.partsRequested[i].part).length;

        //see if there are enough to match the request minimum (if none was provided, then assume a minimum of 1)
        if (partsMatchingRequest < (goal.partsRequested[i].min || 1))
            return false;
    }

    return true;
}

/**
 * checks whether or not this creep meets all of the preferences of the goal
 * @param {Creep} creep
 * @param goal
 */
export function isCreepPreferred(creep: Creep, goal: Goal) {
    //preferred energy
    if (goal.prefersEnergy && goal.prefersEnergy > creep.store.energy)
        return false;

    //preferred capacity
    if (goal.prefersOpenCapacity && (goal.prefersOpenCapacity.amount > creep.store.getFreeCapacity(goal.prefersOpenCapacity.resource)))
        return false;

    //part requests
    for (let i = 0; i < goal.partsRequested.length; i++) {
        //count parts matching the request
        const partsMatchingRequest = creep.body.filter(bpd => bpd.type === goal.partsRequested[i].part).length;

        //see if there are enough to match the request minimum (if none was provided, then assume no preference)
        if (partsMatchingRequest < (goal.partsRequested[i].preferred || 0))
            return false;
    }

    return true;
}

/**
 * returns an opts object for use with calls to moveTo()
 * this way all creeps can move in a consistent fashion, and have pathing adjusted globally
 * @param {Behavior} behavior
 * @param range
 */
export function moveToOptions(behavior: Behavior, range?: number): MoveToOpts {
    let opts: MoveToOpts =
    {
        visualizePathStyle: pathStyle(behavior), //set visualization style
        reusePath: 5 //number of ticks to reuse pathing information for before recalculating
    };

    //override values from global settings if present
    if (Memory.globalSettings && Memory.globalSettings.moveToReusePathTicks)
        opts.reusePath = Memory.globalSettings.moveToReusePathTicks;

    if (range)
        opts.range = range; //if provided, we only need to get within this many spaces of the destination

    return opts;
}
/**
 * returns a visualizePathStyle object for use with creep.moveTo()
 * the path is stylized based on the state of the creep
 * this function is intended to provide consistent, meaningful visualization
 *
 * @returns {{stroke: string, opacity: number, lineStyle: string}} a visual style config object for use with creep.moveTo()
 * @param behavior
 */
function pathStyle(behavior: Behavior): PolyStyle {
    //this is the same as the default visual style
    let result: PolyStyle = { stroke: '#FFFFFF', opacity: 0.6, lineStyle: undefined };

    // update color based on creep role
    switch (behavior.name) {
        case 'BehaviorIdle':
            result.stroke = '#FFFFFF';
            break;
        case 'BehaviorConstruct':
            result.stroke = '#0011ff';
            break;
        case 'BehaviorCollectEnergy':
        case 'BehaviorHarvestEnergy':
        case 'BehaviorHarvestToContainer':
            result.stroke = '#FFFF00';
            break;
        case 'BehaviorStoreResource':
        case 'BehaviorCollectEnergyFromStorage':
            result.stroke = '#AAAA00';
            break;
        case 'BehaviorCollectFromContainer':
        case 'BehaviorCollectEnergyFromTerminal':
        case 'BehaviorCollectFromLab':
        case 'BehaviorCleanupDroppedResources':
            result.stroke = '#49ff00';
            break;
        case 'BehaviorRepair':
            result.stroke = '#00FFFF';
            break;
        case 'BehaviorSupplySpawnOrExtension':
        case 'BehaviorSupplyStructure':
        case 'BehaviorSupplyLabWithMineral':
        case 'BehaviorSupplyTerminal':
            result.stroke = '#ff00bb';
            break;
        case 'BehaviorTransportMinerals':
        case 'BehaviorTransportEnergy':
            result.stroke = '#7f005f';
            break;
        case 'BehaviorUpgrade':
            result.stroke = '#de7800';
            break;
        case 'BehaviorSellResourceAtAnyPrice':
            result.stroke = '#7c350f';
            break;
        case 'BehaviorMuster':
        case 'BehaviorGoToPosition':
        case 'BehaviorGoToRoom':
            result.stroke = '#bdbdbd';
            break;
        case 'BehaviorClaimRoom':
        case 'BehaviorAttackController':
        case 'BehaviorAttackCreep':
            result.stroke = '#FF0000';
            break;

        default:
            console.log("[libCreep.pathStyle] unstyled behavior: " + behavior.name);
    }

    return result;
}
