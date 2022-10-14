/** Abstract class to define all search problems */
class Searchable{

    constructor() {
        if (this.constructor === Searchable) {
            throw new Error("Abstract class searchable cannot be instantiated");
        }
    }

    get startState() {
        if (this.constructor === Searchable) {
            throw new Error("Abstract propery startState must be instantiated")
        }
    }

    get goalState() {
        if (this.constructor === Searchable) {
            throw new Error("Abstract propery goalState must be instantiated")
        }
    }

    getStateTransitions() {
        if (this.constructor === Searchable) {
            throw new Error("Abstract method getStateTransitions must be instantiated")
        }
    }

}
export default Searchable;