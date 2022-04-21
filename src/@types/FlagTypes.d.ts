/**
 * represents an object responsible for creating flags
 */
interface FlagProvider {

    createFlagsIfAbsent: (input: Room) => void;
}

/**
 * specification for a flag.  Defines what a particular flag in the world means.
 */
interface FlagSpec {
    /**
     * primary color of the flag
     */
    primary: ColorConstant;

    /**
     * secondary color of the flag
     */
    secondary: ColorConstant;

    /**
     * name of this particular spec, NOT the name of the flag.
     */
    name?: string;

    /**
     * if set, this GoalProvider is polled during goal evaluation
     * for example, a harvest flag indicates a source that needs harvesting, but it may not have energy right now
     * the GoalProvider is called for this flag to determine what should be done with it
     */
    goalProvider?: GoalProvider;

    /**
     * if set, this flag represents an Order to carry out some task
     * for example, a debug flag to wipe all creep assignments in the room
     */
    order?: FlagOrder;
}

/**
 * represents a command for overarching behavior
 */
interface FlagOrder {
    run(flag: Flag): void;
}

interface FlagMemory {
    target?: string | null,              //target of this flag.  Exact meaning varies by flag, but typically this is the structure the flag is referring to
    value?: number,                      //value of this flag.   Exact meaning varies by flag, but typically this is used by flags that need to keep track of some numeric value
    orderState?: string,                 //state of this flag.   Exact meaning varies by flag, but typically this is used for the flag to keep track of which step of a complicated order it is on
    requestingCreepType?: string,        //the type of creep this flag would like to come assist.  In this way the flag can ask for help from nearby rooms, but also alter/cancel said request if something changes before help is sent.
    requestingCreepMemory?: CreepMemory, //if specified, memory to assign the newly created creep.  If not specified, a default goal will be created to send the creep to the room making the request.
    flagCreeps?: string[],               //names of creeps working with for this flag.  Exact meaning varies by flag, but typically this is either creeps that were spawned in response to a request from this flag or creeps which are rallying to this flag.
}
