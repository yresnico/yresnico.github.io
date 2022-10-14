import Maze3dGenerator from "./maze-3d-generator.js";
import shuffle from "./shuffle.js";
import Maze3d from "./maze3d.js";
class DFSMaze3dGenerator extends Maze3dGenerator{
    constructor(depth, height, width){
        super();
        this.depth = depth;
        this.height = height;
        this.width = width;
    }
    generate(){
        let board = new Maze3d(this.depth, this.height, this.width);
        let z = Math.floor(Math.random()* this.depth);
        let y = Math.floor(Math.random()* this.height);
        let x = Math.floor(Math.random()* this.width);
        let beginning = board.matrix[z][y][x];
        board.matrix[z][y][x].makeStart();
        board.start = board.matrix[z][y][x];
        this.DFSTraverse(board, beginning);
        let hasEnd = false;
        while(!hasEnd){
            z = Math.floor(Math.random()* this.depth);
            y = Math.floor(Math.random()* this.height);
            x = Math.floor(Math.random()* this.width);
            let ending = board.matrix[z][y][x];
            hasEnd = board.matrix[z][y][x].makeEnd();
        }
        board.end = board.matrix[z][y][x];
        board.curNode = board.start;
        return board;
    }
    DFSTraverse(board, startNode){
        let stack = [];
        startNode.visited = true;
        let numVisited = 1;
        let numToVisit = this.depth * this.height * this.width;
        let curNode = startNode;
        while(numVisited < numToVisit){
            let availableNeighbors = curNode.availableNeighbors.slice();
            if(availableNeighbors.length > 0){
                shuffle(availableNeighbors);
                let n = availableNeighbors[0];
                curNode.hammer(n);
                stack.push(curNode);
                curNode = n;
                curNode.visited = true;
                numVisited++;
            } else {
                curNode = stack.pop();
            }
        }
    }
}

export default DFSMaze3dGenerator;