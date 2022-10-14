import Maze3dState from "./maze-3d-state.js";
import Searchable from "./searchable.js";
import Maze3d from "../generation/maze3d.js";
import Node from "./node.js";
class Maze3dDomain extends Searchable{
    static DIRECTIONS = new Map([[0, "above"], [1, "below"], [2, "up"], [3, "down"], [4, "left"], [5, "right"]]);
    
    /**
     * Sets up a 3d maze problem
     * @param {Maze3d} maze3d 
     * @param {Node} currentNode 
     */
    constructor(maze3d, currentNode = null) {
        super();
        this.maze = maze3d;
        this.curNode = currentNode ?? this.maze.curNode;
    }

    /**
     * Returns the maze's current node
     * @returns Maze3dState
     */
    getCurState() {
        let aState = new Maze3dState(this.maze.curNode);
        
        return aState;
    }

    /**
     * Meant to return the start state, but for the current algorithm implementations 
     * coerced to return the state of the current cell instead;
     * @returns Maze3dState
     */
    getStartState() {
        let aState = new Maze3dState(this.maze.curNode);
        return aState;
    }

    /**
     * Checks if the current node's cell is the exit to the maze
     * @param {Node} node 
     * @returns  bool
     */
    getGoalState(node) {
        if(node.state.key === this.maze.end.value){
            return true;
        }
        return false;
    }

    /**
     * Returns all of the valid neighbors and the actions that led to them as array of 2-length arrays
     * @param {Node} node 
     * @returns array
     */
    getStateTransitions(node) {
        let results = [];
        for(let i = 0; i < Maze3dDomain.DIRECTIONS.size; i++) {
            if(node.curCell.neighbors[i] && !node.curCell.walls[i]) {
                results.push([Maze3dDomain.DIRECTIONS.get(i), new Maze3dState(node.curCell.neighbors[i])])
            }
        }
        return results;
    }
    /**
     * Given a node, return the list of actions that got there (from the start given to the problem)
     * @param {Node} node 
     * @returns array
     */
    solution(node) {
        let curNode = node;
        let actionList = []
        while(curNode.parent != null) {
            actionList.unshift(curNode.action);
            curNode = curNode.parent;
        }
        return actionList;
    }

    /**
     * For priority-queue based searches, e.g. Djikstra, returns an array containing all of the cells in the maze
     * @returns array
     */
    getAllStates() {
        let result = [];
        for(let i = 0; i < this.maze.depth; i++) {
            for(let j = 0; j < this.maze.height; j++) {
                for(let k = 0; k< this.maze.width; k++) {
                    result.push(new Maze3dState(this.maze.matrix[i][j][k]))
                }
            }
        }
        return result;
    }
    /**
     * for comparison purposes (getGoalState was already repurposed to return a boolean instead)
     * @returns str
     */
    getGoalKey() {
        return this.maze.end.value;
    }

    /**
     * Heuristic function to estimate distance
     * @param {Maze3dState} maze3dState 
     * @returns num
     */
    estimateDistance(maze3dState) {
        let estZ = Math.abs(maze3dState.curCell.depth - this.maze.end.depth);
        let estY = Math.abs(maze3dState.curCell.height - this.maze.end.height);
        let estX = Math.abs(maze3dState.curCell.width - this.maze.end.width);
        return estZ + estY + estX; 
    }
}
export default Maze3dDomain;