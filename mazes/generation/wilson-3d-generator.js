import Maze3dGenerator from "./maze-3d-generator.js";

class Wilson3dGenerator extends Maze3dGenerator {
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
        let hasEnd = false;
        let newZ;
        let newY;
        let newX;
        let ending;
        while(!hasEnd){
            newZ = Math.floor(Math.random()* this.depth);
            newY = Math.floor(Math.random()* this.height);
            newX = Math.floor(Math.random()* this.width);
            ending = board.matrix[newZ][newY][newX];
            hasEnd = board.matrix[newZ][newY][newX].makeEnd();
        }
        
    }
}

export default Wilson3dGenerator;