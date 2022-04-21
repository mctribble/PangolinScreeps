import { moveToOptions } from "../utils/lib.creep";
import { idlePos, roomContainers, roomContainersAndStorage } from "../utils/lib.room";
import { behaviorLog, roomLog } from "../utils/lib.log";
import { BehaviorStoreResource } from "./BehaviorStoreResource";

/**
 * special behavior that is run on creeps that have no goal assigned.
 * no goal should ever use this behavior!
 */
export const BehaviorIdle: Behavior =
{
    name: "BehaviorIdle",
    run(creep: Creep) {
        //idle creeps are willing to share
        creep.memory.isWillingToShareEnergy = true;

        //track how long unit has been idle
        if (!creep.memory.idleSince)
            creep.memory.idleSince = Game.time;

        //reasons for a creep to suicide/recycle itself
        if ((!creep.memory.specialized && (Game.time - creep.memory.idleSince) >= 100) || //unspecialized creeps that are idle for 100 ticks
            (_.every(creep.body, bpd => bpd.hits === 0 || bpd.type === MOVE)))    //creeps where all working parts are MOVE
        {
            const roomSpawn = creep.room.find(FIND_MY_SPAWNS)[0];
            if (!roomSpawn) {
                behaviorLog(creep.room.name, LogType.warning, this, "creep " + creep.name + " has committed suicide.");
                creep.suicide();
            }
            else {
                creep.say("Recycling");
                if (roomSpawn.recycleCreep(creep) === ERR_NOT_IN_RANGE)
                    creep.moveTo(roomSpawn, moveToOptions(this));
            }
        }
        else {
            creep.say("ZZZ");
            const idleFlag = _.find(Game.flags, flag => (flag.pos.roomName === creep.room.name));
            if (idleFlag)
                creep.moveTo(idleFlag, moveToOptions(this));
            else
                creep.moveTo(idlePos(creep.room), moveToOptions(this));
        }
    }
};
