import { Random } from "utils/random";

export const SpawnManager = {
    tick: function (): void {
        _.forEach(Game.rooms, function (room) {
            if (room.controller && room.controller.my) {
                if (room.find(FIND_MY_CREEPS).length < 5) {
                    _.forEach(room.find(FIND_MY_SPAWNS), function (spawn) {
                        spawn.spawnCreep([WORK, MOVE, CARRY], Random.string());
                    });
                }
            }
        });
    }
};
