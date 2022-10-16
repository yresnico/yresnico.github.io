import Node from "../searchables/node.js";
import PrioritySearch from "./priority-search.js"

class Djikstra extends PrioritySearch{
    constructor(searchable){
        /*
        initially wanted to utilize a compator built into the problem. Also need
        to utilize the problem space build in state distance.
        let defaultComparitor = (a, b) => a.pathCost < b.pathCost;
        super(searchable.comparitor ?? defaultComparitor);
        */
        super((a, b) => a.cost < b.cost);
        this.domain = searchable;
    }
    solve() {
        let allStateList = this.domain.getAllStates();
        let sourceState = this.domain.getStartState();
        let explored = [];
        for(let state of allStateList){
            if(state.key !== sourceState.key){
                let newNode = new Node(state, Infinity);
                this.queue.push(newNode);

            } else {
                let newNode = new Node(state, 0);
                this.queue.push(newNode);
            }
        } 
        this.stateCount = 0;
        while(!this.queue.isEmpty()) {
            let curNode = this.queue.pop();
            this.stateCount++;
            for(let [action, state] of this.domain.getStateTransitions(curNode.state)) {
                if(this.queue.peekByKey(state.key)){
                    let newDistance = curNode.cost + this.domain.getDistance(curNode.state, state);
                    let oldDistance = this.queue.peekByKey(state.key).cost;
                    if(newDistance < oldDistance){
                        let newNode = new Node(state, newDistance);
                        newNode.action = action;
                        newNode.parent = curNode;
                        this.queue.removeByKey(state.key);
                        this.queue.push(newNode);
                    }      
                }                      
            }
            explored.push(curNode);
        }
        let goalNodeIdx = explored.map(e => e.state.key).indexOf(this.domain.getGoalKey());
        return this.domain.solution(explored[goalNodeIdx]);        
    }
}
export default Djikstra;