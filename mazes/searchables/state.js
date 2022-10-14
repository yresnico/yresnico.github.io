/** Abstract class to define possible states of a search problem */

class State {
    #key // the state is represented by a string
    
    constructor(key) {
        
        if (this.constructor === State) {
            throw new Error('State cannot be initialized');
        }

        this.#key = key;
    }

    get key() {
        return this.#key;
    }

    equals(other) {
        return other instanceof State && this.#key === other.#key;
    }
}
export default State;