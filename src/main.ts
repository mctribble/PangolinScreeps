import { ErrorMapper } from "utils/ErrorMapper";
import { HarvestFlagProvider } from "flags/harvestFlagProvider"
import { SpawnManager } from "managers/spawnManager";
import { runBehaviorByName, runCreepBehavior } from "behaviors/runBehaviorByName";
import { BehaviorIdle } from "behaviors/BehaviorIdle";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {

    console.log(`=====PangolinScreeps: tick ${Game.time}=====`);

    //ensure all rooms have harvest flags
    _.forEach(Game.rooms, room => HarvestFlagProvider.createFlagsIfAbsent(room));

    //invoke managers
    SpawnManager.tick();

    //creep behavior
    _.forEach(Game.creeps, creep => {
        if (!runCreepBehavior(creep))
            BehaviorIdle.run(creep);
    });


    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
});


