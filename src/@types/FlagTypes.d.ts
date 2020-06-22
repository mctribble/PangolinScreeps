/**
 * represents an object responsible for creating flags
 */
interface FlagProvider {

    createFlagsIfAbsent: (input: Room) => void;
}
