import Node from "../searchables/node.js";
import SearchAlgorithm from "./search-algorithm.js";

class DFS extends SearchAlgorithm{
    constructor(searchable){
        super();
        this.domain = searchable;
    }
    solve(){
        let node = new Node(this.domain.getStartState(), 0);
        let frontier = [node];        
        let explored = [];
        this.stateCount = 0;
        while(frontier.length > 0) {
            let curNode = frontier.pop();
            this.stateCount++;
            explored.push(curNode)
            for(let [action, state] of this.domain.getStateTransitions(curNode.state)) {
                let newNode = new Node(state, 0);
                newNode.action = action;
                newNode.parent = curNode;
                if(this.domain.getGoalState(newNode)){
                    return this.domain.solution(newNode);
                }
                if(!explored.find(e => e.state.equals(newNode.state)) && !frontier.find(e => e.state.equals(newNode.state))){
                    frontier.push(newNode);
                }
            }
        }
        return -1;
    }

}
export default DFS;