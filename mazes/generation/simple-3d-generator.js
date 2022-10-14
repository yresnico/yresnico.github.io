import Maze3d from "./maze3d.js";
import Maze3dGenerator from "./maze-3d-generator.js";
class Simple3dGenerator extends Maze3dGenerator{
    constructor(depth, height, width){
        super();
        this.depth = depth;
        this.height = height;
        this.width = width;
    }
    generate(){
        let board = new Maze3d(this.depth, this.height, this.width, 3);
        let z = Math.floor(Math.random()* this.depth);
        let y = Math.floor(Math.random()* this.height);
        let x = Math.floor(Math.random()* this.width);
        let beginning = board.matrix[z][y][x];
        beginning.makeStart();
        board.start = beginning;
        let hasEnd = false;
        let newZ;
        let newY;
        let newX;
        let ending;
        // alert(hasEnd)
        while(!hasEnd){
            newZ = Math.floor(Math.random()* this.depth);
            newY = Math.floor(Math.random()* this.height);
            newX = Math.floor(Math.random()* this.width);
            ending = board.matrix[newZ][newY][newX];
            // alert(`Z = ${newZ} "Y = ${newY}, X = ${newX}`);
            // alert(ending.wallCount);
            hasEnd = board.matrix[newZ][newY][newX].makeEnd();
        }
        board.end = ending;
        //this.generateRandomWalls(board);
        let difference =[newZ-z, newY - y, newX - x]; 
        this.simpleCarveOut(beginning, ending, difference);
        //this.carveOut(board, beginning, ending);
        this.breakRandomWalls(board, 2);
        board.curNode = board.start;
        return board;
    }
    simpleCarveOut(beginning, ending, difference){
        let curNode = beginning;
        let [zDif, yDif, xDif] = difference;
        
        while(Math.abs(zDif) > 0 && Math.abs(yDif) > 0 && Math.abs(xDif) > 0){
            let direction = Math.floor(Math.random()*3);
            switch (direction) {
                case 0:
                    curNode = this.closeDistance(zDif, "Depth", curNode)
                    if(zDif > 0) {
                        zDif--;
                    }else {
                        zDif++;
                    }
                    break;
                case 1:
                    curNode = this.closeDistance(yDif, "Height", curNode)
                    if(yDif > 0) {
                        yDif--;
                    }else {
                        yDif++;
                    }
                    break;
                case 2:
                    curNode = this.closeDistance(xDif, "Width", curNode)
                    if(xDif > 0) {
                        xDif--;
                    }else {
                        xDif++;
                    }
                    break;
                default:
                    break;
            }
        }
        while(Math.abs(zDif) > 0 && Math.abs(yDif) > 0){
            let direction = Math.floor(Math.random()*2);
            switch (direction) {
                case 0:
                    curNode = this.closeDistance(zDif, "Depth", curNode)
                    if(zDif > 0) {
                        zDif--;
                    }else {
                        zDif++;
                    }
                    break;
                case 1:
                    curNode = this.closeDistance(yDif, "Height", curNode)
                    if(yDif > 0) {
                        yDif--;
                    }else {
                        yDif++;
                    }
                    break;
                default:
                    break;
            }
        }
        while(Math.abs(zDif) > 0 && Math.abs(xDif) > 0){
            let direction = Math.floor(Math.random()*3);
            switch (direction) {
                case 0:
                    curNode = this.closeDistance(zDif, "Depth", curNode)
                    if(zDif > 0) {
                        zDif--;
                    }else {
                        zDif++;
                    }
                    break;
                case 1:
                    curNode = this.closeDistance(xDif, "Width", curNode)
                    if(xDif > 0) {
                        xDif--;
                    }else {
                        xDif++;
                    }
                    break;
                default:
                    break;
            }
        }
        while(Math.abs(yDif) > 0 && Math.abs(xDif) > 0){
            let direction = Math.floor(Math.random()*2);
            switch (direction) {
                case 0:
                    curNode = this.closeDistance(yDif, "Height", curNode)
                    if(yDif > 0) {
                        yDif--;
                    }else {
                        yDif++;
                    }
                    break;
                case 1:
                    curNode = this.closeDistance(xDif, "Width", curNode)
                    if(xDif > 0) {
                        xDif--;
                    }else {
                        xDif++;
                    }
                    break;
                default:
                    break;
            }
        }
        while(Math.abs(zDif) > 0) {
            curNode = this.closeDistance(zDif, "Depth", curNode);
            if(zDif > 0){
                zDif--;
            } else {
                zDif++;
            }
        }
        while(Math.abs(yDif) > 0) {
            curNode = this.closeDistance(yDif, "Height", curNode);
            if(yDif > 0){
                yDif--;
            } else {
                yDif++;
            }
        }
        while(Math.abs(xDif) > 0) {
            curNode = this.closeDistance(xDif, "Width", curNode);
            if(xDif > 0){
                xDif--;
            } else {
                xDif++;
            }
        }
    }

    closeDistance(value, direction, cell) {
        if(value > 0){
            switch(direction) {
                case "Depth":
                    cell.hammer(cell.neighbors[1]);
                    return cell.neighbors[1];
                case "Height":
                    cell.hammer(cell.neighbors[3]);
                    return cell.neighbors[3];
                case "Width":
                    cell.hammer(cell.neighbors[5]);
                    return cell.neighbors[5];
            }
        } else {
            switch(direction) {
                case "Depth":
                    cell.hammer(cell.neighbors[0]);
                    return cell.neighbors[0];
                case "Height":
                    cell.hammer(cell.neighbors[2]);
                    return cell.neighbors[2];
                case "Width":
                    cell.hammer(cell.neighbors[4]);
                    return cell.neighbors[4];
            }
        }
    }
    generateRandomWalls(board){
        for(let i = 0; i < this.depth; i++){
            for(let j = 0; j < this.height; j++){
                for(let k = 0; k < this.width; k++){
                    board.matrix[i][j][k].generateRandomWalls(3);
                }
            }
        }
    }
    carveOut(board, startNode, endNode){
        let target = endNode;
        let visited = new Set();
        let stack = [];
        let path = [];
        path.push(startNode);
        stack.push(startNode);
        while(stack.length > 0){
            let curNode = stack.shift();
            if(!visited.has(curNode.value)){
                visited.add(curNode.value);
                if(curNode.value === target.value){
                    return true;
                }
                let neighbors = curNode.neighbors.slice();
                this.shuffle(neighbors);
                for(const neighbor of neighbors){
                    if(neighbor !== null){
                        if(!visited.has(neighbor.value)){
                            curNode.hammer(neighbor);
                            stack.push(neighbor)
                            break;
                        }
                    }

                }
            }
        }
    }
    shuffle(arr){
        for(let i = 0; i < arr.length; i++){
            let j = Math.floor(Math.random() * arr.length);
            if(j !== i){
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
    }
    breakRandomWalls(board, numWalls = 3){
        for(let i = 0; i < this.depth; i++){
            for(let j = 0; j < this.height; j++){
                for(let k = 0; k < this.width; k++){
                    board.matrix[i][j][k].openRandomWalls(numWalls);
                }
            }
        }
    }
}

export default Simple3dGenerator;