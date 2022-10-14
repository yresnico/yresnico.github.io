import Node from "../searchables/node.js";
import SearchAlgorithm from "./search-algorithm.js";

class BFS extends SearchAlgorithm{
    constructor(searchable){
        super();
        this.domain = searchable;
    }
    solve(){
        let node = new Node(this.domain.getStartState(), 0);
        let frontier = [node];        
        let explored = new Set();
        let inExplored = new Set();
        this.stateCount = 0;
        while(frontier.length > 0) {
            let curNode = frontier.shift();
            this.stateCount++;
            explored.add(curNode)
            inExplored.add(curNode.state.key)
            for(let [action, state] of this.domain.getStateTransitions(curNode.state)) {
                let newNode = new Node(state, 0);
                newNode.action = action;
                newNode.parent = curNode;
                if(this.domain.getGoalState(newNode)){
                    return this.domain.solution(newNode);
                }
                if(!inExplored.has(newNode.state.key) && !frontier.find(e => e.state.key === newNode.state.key)){
                    frontier.push(newNode);
                }
            }
        }
        return -1;
    }

}
export default BFS;