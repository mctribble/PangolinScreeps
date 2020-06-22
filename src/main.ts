import { ErrorMapper } from "utils/ErrorMapper";
import { HarvestFlagProvider } from "flagProviders/harvestFlagProvider"
import { roomLog } from "utils/lib.log";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {

  console.log(`=====PangolinScreeps: tick ${Game.time}=====`);

  //ensure basic roles exist for all rooms
  // if (Game.time % 10 === 0) {
  _.forEach(Game.rooms, room => HarvestFlagProvider.createFlagsIfAbsent(room));
  // }

  _.forEach(Game.rooms, room => roomLog.error(room, "STATUS", "Hello World!"));

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
