/**
 * Unsure if node is needed, or if I should just include in state
 */

class Node{
    #curState
    #parentNode
    #direction
    #cost

    constructor(state, cost, parent=null, direction=null) {
        this.parent = parent;
        this.state = state;
        this.direction = direction;
        this.cost = cost;
    }

    get state() {
        return this.#curState;
    }
    
    set state(value){
        this.#curState = value;
    }

    get parent() {
        return this.#parentNode;
    }

    set parent(node) {
        this.#parentNode = node;
    }

    get direction() {
        return this.#direction;
    }

    set direction(value) {
        this.#direction = value;
    }

    get cost() {
        return this.#cost;
    }

    set cost(value) {
        this.#cost = value;
    }

}

export default Node;