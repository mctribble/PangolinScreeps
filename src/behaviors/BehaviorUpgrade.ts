import { moveToOptions } from "../utils/lib.creep";

/**
 * upgrades the controller
 */
export const BehaviorUpgrade: Behavior =
{
    name: "BehaviorUpgrade",
    run(creep: Creep) {
        if (creep.room.controller) {
            const upgradeResult = creep.upgradeController(creep.room.controller);
            if (upgradeResult === ERR_NOT_IN_RANGE)
                creep.moveTo(creep.room.controller, moveToOptions(this, 3));
        }

        if (creep.carry.energy === 0)
            delete creep.memory.goal;
    }
};
