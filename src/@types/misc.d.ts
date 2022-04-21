//logging levels
type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

/**
 * represents a request for some number of a specific body part
 */
interface PartRequest {
    part: BodyPartConstant, //desired part
    min?: number,           //minimum required (default: 1)
    preferred?: number      //preferred amount

    //maximum of this part to be put on the goal.
    // Note that this is a "soft cap", meaning an assignment can put it over this number,
    // but no new assignments will be made if the cap has already been reached
    max?: number
}

/**
 * defines how a creep will carry out the associated goal
 */
interface Behavior {
    name: string,

    run(creep: Creep, goalArgs?: any): void;
}

/**
 * used for aggregate counting of creeps and their body parts
 */
interface CreepCounts {
    creeps: number
    parts: CreepPartCount[];
}

interface CreepPartCount {
    part: BodyPartConstant,
    count: number
}
