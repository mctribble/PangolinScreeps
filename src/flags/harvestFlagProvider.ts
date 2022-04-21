import { RoomLog } from "utils/lib.log";
import { Random } from "utils/random";

/**
 * creates harvest flags for sources that currently have none
 */
export const HarvestFlagProvider: FlagProvider = {

    /**
     * creates default harvest flags (YELLOW, GREY) on any energy sources that do not currently have one
     * @param room room to create flags in
     */
    createFlagsIfAbsent: function (room: Room) {
        _.forEach(room.find(FIND_SOURCES), source => {
            if (source.pos.lookFor("flag").length === 0) {
                let newFlagName: string = Random.string();
                source.pos.createFlag(newFlagName, COLOR_YELLOW, COLOR_GREY);
                RoomLog.debug(room, "FLAG_CREATION", "new harvest flag " + newFlagName + " at " + source.pos);
            }
        });
    }
}
