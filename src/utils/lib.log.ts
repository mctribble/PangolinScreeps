
/**
 * contains logging helpers for rooms
 */
export const RoomLog = {
    /**
     * depending on logging settings, may or may not log a message to the console.  If the specified logger is not configured, a setting is automatically added and set to ERROR
     * @param logger the logger to produce a message for
     * @param message the message to log
     */
    debug: function (room: Room, logger: string, message: string) {
        if (!room.memory.logLevels)
            room.memory.logLevels = {}
        if (!room.memory.logLevels[logger])
            room.memory.logLevels[logger] = "ERROR";

        if (room.memory.logLevels)
            if (room.memory.logLevels[logger] === "DEBUG")
                console.log("[DEBUG]" + room.name + ": " + message);
    },

    /**
     * depending on logging settings, may or may not log a message to the console.  If the specified logger is not configured, a setting is automatically added and set to ERROR
     * @param logger the logger to produce a message for
     * @param message the message to log
     */
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

    /**
     * depending on logging settings, may or may not log a message to the console.  If the specified logger is not configured, a setting is automatically added and set to ERROR
     * @param logger the logger to produce a message for
     * @param message the message to log
     */
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

    /**
     * depending on logging settings, may or may not log a message to the console.  If the specified logger is not configured, a setting is automatically added and set to ERROR
     * @param logger the logger to produce a message for
     * @param message the message to log
     */
    error: function (room: Room, logger: string, message: string) {
        if (!room.memory.logLevels)
            room.memory.logLevels = {}
        if (!room.memory.logLevels[logger])
            room.memory.logLevels[logger] = "ERROR";

        console.log("[ERROR]" + room.name + ": " + message);
    }
}

/**
 * contains global logging helpers
 */
export const Log = {
    /**
     * depending on logging settings, may or may not log a message to the console.  If the specified logger is not configured, a setting is automatically added and set to ERROR
     * @param logger the logger to produce a message for
     * @param message the message to log
     */
    debug: function (logger: string, message: string) {
        if (!Memory.globalLogLevels)
            Memory.globalLogLevels = {}
        if (!Memory.globalLogLevels[logger])
            Memory.globalLogLevels[logger] = "ERROR";

        if (Memory.globalLogLevels)
            if (Memory.globalLogLevels[logger] === "DEBUG")
                console.log("[DEBUG]: " + message);
    },

    /**
     * depending on logging settings, may or may not log a message to the console.  If the specified logger is not configured, a setting is automatically added and set to ERROR
     * @param logger the logger to produce a message for
     * @param message the message to log
     */
    info: function (logger: string, message: string) {
        if (!Memory.globalLogLevels)
            Memory.globalLogLevels = {}
        if (!Memory.globalLogLevels[logger])
            Memory.globalLogLevels[logger] = "ERROR";

        if (Memory.globalLogLevels)
            if (Memory.globalLogLevels[logger] === "DEBUG" ||
                Memory.globalLogLevels[logger] === "INFO")
                console.log("[INFO]: " + message);
    },

    /**
     * depending on logging settings, may or may not log a message to the console.  If the specified logger is not configured, a setting is automatically added and set to ERROR
     * @param logger the logger to produce a message for
     * @param message the message to log
     */
    warn: function (logger: string, message: string) {
        if (!Memory.globalLogLevels)
            Memory.globalLogLevels = {}
        if (!Memory.globalLogLevels[logger])
            Memory.globalLogLevels[logger] = "ERROR";

        if (Memory.globalLogLevels)
            if (Memory.globalLogLevels[logger] === "DEBUG" ||
                Memory.globalLogLevels[logger] === "INFO" ||
                Memory.globalLogLevels[logger] === "WARN")
                console.log("[WARN]: " + message);
    },

    /**
     * depending on logging settings, may or may not log a message to the console.  If the specified logger is not configured, a setting is automatically added and set to ERROR
     * @param logger the logger to produce a message for
     * @param message the message to log
     */
    error: function (logger: string, message: string) {
        if (!Memory.globalLogLevels)
            Memory.globalLogLevels = {}
        if (!Memory.globalLogLevels[logger])
            Memory.globalLogLevels[logger] = "ERROR";

        console.log("[ERROR]: " + message);
    }
}
