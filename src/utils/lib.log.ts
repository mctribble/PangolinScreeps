
export const roomLog = {
    debug: function (room: Room, logger: string, message: string) {
        if (!room.memory.logLevels)
            room.memory.logLevels = {}
        if (!room.memory.logLevels[logger])
            room.memory.logLevels[logger] = "ERROR";

        if (room.memory.logLevels)
            if (room.memory.logLevels[logger] === "DEBUG")
                console.log("[DEBUG]" + room.name + ": " + message);
    },

    info: function (room: Room, logger: string, message: string) {
        if (!room.memory.logLevels)
            room.memory.logLevels = {}
        if (!room.memory.logLevels[logger])
            room.memory.logLevels[logger] = "ERROR";

        if (room.memory.logLevels)
            if (room.memory.logLevels[logger] === "DEBUG" ||
                room.memory.logLevels[logger] === "INFO")
                console.log("[INFO]" + room.name + ": " + message);
    },

    warn: function (room: Room, logger: string, message: string) {
        if (!room.memory.logLevels)
            room.memory.logLevels = {}
        if (!room.memory.logLevels[logger])
            room.memory.logLevels[logger] = "ERROR";

        if (room.memory.logLevels)
            if (room.memory.logLevels[logger] === "DEBUG" ||
                room.memory.logLevels[logger] === "INFO" ||
                room.memory.logLevels[logger] === "WARN")
                console.log("[WARN]" + room.name + ": " + message);
    },

    error: function (room: Room, logger: string, message: string) {
        if (!room.memory.logLevels)
            room.memory.logLevels = {}
        if (!room.memory.logLevels[logger])
            room.memory.logLevels[logger] = "ERROR";

        console.log("[ERROR]" + room.name + ": " + message);
    }
}

