export const Random = {
    string: function () {
        return Math.random().toString(36).slice(2).toString();  //converts the random number to base 36, lops off the '0.' on the front of it, and returns it
    }
}
