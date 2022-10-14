import Maze3dGenerator from "./maze-3d-generator.js";
import shuffle from "./shuffle.js";
import Maze3d from "./maze3d.js";

class Prim3dGenerator extends Maze3dGenerator {
    constructor(depth, height, width) {
        super();
        this.depth = depth;
        this.height = height;
        this.width = width;
    }

    generate() {
        let board = new Maze3d(this.depth, this.height, this.width, 3);
        let z = Math.floor(Math.random()* this.depth);
        let y = Math.floor(Math.random()* this.height);
        let x = Math.floor(Math.random()* this.width);
        let beginning = board.matrix[z][y][x];
        beginning.makeStart();
        board.start = beginning;
        this.primWalk(board, beginning);
        let hasEnd = false;
        let newZ;
        let newY;
        let newX;
        let ending;
        while(!hasEnd) {
            newZ = Math.floor(Math.random()* this.depth);
            newY = Math.floor(Math.random()* this.height);
            newX = Math.floor(Math.random()* this.width);
            ending = board.matrix[newZ][newY][newX];
            hasEnd = board.matrix[newZ][newY][newX].makeEnd();
        }
        board.end = ending;
        board.curNode = board.start;
        return board;
    }

    primWalk(board, startNode) {
        let toAdd = [];
        toAdd.push(startNode);
        while(toAdd.length > 0){
            shuffle(toAdd);
            let curNode = toAdd.pop();
            if(curNode.inMaze) {
                continue;
            }
            curNode.inMaze = true;
            let innerNeighbors = [];
            let innerNeighbor = null;

            for(let neighbor of curNode.neighbors) {
                if(neighbor !== null && neighbor.inMaze) {
                    innerNeighbors.push(neighbor);
                }
            }

            if(innerNeighbors.length > 0) {
                shuffle(innerNeighbors);
                innerNeighbor = innerNeighbors[0];
                curNode.hammer(innerNeighbor);
            }

            for(let neighbor of curNode.neighbors) {
                if(neighbor !== null && !neighbor.inMaze && !neighbor.inToAdd) {
                    toAdd.push(neighbor);
                    neighbor.inToAdd = true;
                }
            }
        }

    }
}

export default Prim3dGenerator;