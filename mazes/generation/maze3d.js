import Cell from "./cell.js";

class Maze3d{
    #height
    #width
    #depth
    static isIntegerex = /^\d+$/;
    static directions = new Map([
        ['above', 0], ['below', 1], ["up", 2], ["down", 3], ["left", 4], ["right", 5]
    ])
    constructor(depth = 1, height = 2, width = 2, defaultWallNumber = 0) {
        this.depth = depth;
        this.height = height;
        this.width = width;
        this.matrix = this.initiate(depth, height, width, defaultWallNumber);
        this.start = null;
        this.end = null;
        this.curNode = null;
    }
    
    get depth() {
        return this.#depth;
    }

    set depth(value) {
        if(!Maze3d.isIntegerex.test(value)){
            throw new Error("Depth must be a positive integer");
        }
        this.#depth = value;
    }

    get height() {
        return this.#height;
    }

    set height(value) {
        if(!Maze3d.isIntegerex.test(value)){
            throw new Error("Height must be a positive integer");
        }
        this.#height = value;
    }

    get width() {
        return this.#width;
    }

    set width(value) {
        if(!Maze3d.isIntegerex.test(value)){
            throw new Error("Width must be a positive integer");
        }
        this.#width = value;
    }

    initiate(depth, height, width, defaultWallNumber) {
        let board = Array.from(Array(depth), () => Array.from(Array(height), () => Array(width)));
        for(let i = 0; i < depth; i++){
            for(let j = 0; j < height; j++){
                for(let k = 0; k < width; k++){
                    let curCell = board[i][j][k] = new Cell(i, j, k, defaultWallNumber);
                    if(i !== 0){
                        curCell.addNeighbor(board[i -1][j][k], 0);
                    }
                    if(j !== 0){
                        curCell.addNeighbor(board[i][j -1][k], 2);
                    }
                    if(k !== 0){
                        curCell.addNeighbor(board[i][j][k - 1], 4);
                    }
                    // set floors on bottom floor, ceilings on top floor
                    if(i === 0){
                        board[i][j][k].walls[0] = true;
                    } else if (i === depth -1){
                        board[i][j][k].walls[1] = true;
                    }
                }
            }
        }
        return board;
    }

    toString() {
        let separator = '+';
        let ceilingSymbol = '-';
        let paddingString = ' ';
        let bottomPadString = ' ';
        let paddingSymbol = '____';
        let bottomPadSymbol = '\u203E\u203E\u203E\u203E';
        let overString;
        for(let i = 0; i< this.width; i++){
            paddingString += paddingSymbol;
            bottomPadString += bottomPadSymbol
        }
        let resultStr = '';
        for(let i = 0; i < this.depth; i++){
            resultStr += `Level ${i}:\n`;
            resultStr += paddingString;
            for(let j = 0; j < this.height; j++){
                if(j > 0){
                    overString = '|';
                }
                let lineStr = ''
                let spacer = ' '
                for(let k = 0; k < this.width; k++){
                    lineStr += spacer + this.matrix[i][j][k].toString() + spacer + `${this.matrix[i][j][k].rightWalled ? '|' : ' '}`;
                    overString += ` ${this.matrix[i][j][k].upWall? ceilingSymbol: ' '} +`
                }
                if(j > 0){
                    overString = overString.slice(0, -1);
                    resultStr += '\n' + overString + '|';
                }
                resultStr += '\n|' + lineStr;
                resultStr = resultStr.slice(0, -1) + "|";
            }
            resultStr += '\n' + bottomPadString + '\n';
        }
        
        return resultStr;
    }
    /**
     * replaced the internal maze and resets all appropriate variables
     * @param {Maze3d} maze3d 
     */
    fromMaze3d(maze3d) {
        this.matrix = maze3d.matrix;
        this.depth = maze3d.depth;
        this.height = maze3d.height;
        this.width = maze3d.width;
        this.start = maze3d.start;
        this.end = maze3d.end;
        this.curNode = maze3d.curNode;
    }

    toJSON() {
        return {depth: this.#depth, height: this.#height, width: this.#width, matrix: this.matrix, start: this.start, end: this.end, curNode: this.curNode}
    }
    /**
     * Gets a JSON.parsed stringoject from JSON.stringify(maze3d) and returns a new maze3d that is of the proper type and has correct children
     * @param {object} storageObj 
     * @returns 
     */
    static fromStorage(storageObj) {
        let newMaze = new Maze3d();
        newMaze.depth = storageObj['depth'];
        newMaze.height = storageObj['height'];
        newMaze.width = storageObj['width'];
        newMaze.matrix = storageObj['matrix'];
        newMaze.start = storageObj['start'];
        newMaze.end = storageObj['end'];
        newMaze.curNode = storageObj['curNode'];
        newMaze.rehydrate(newMaze.matrix);
        newMaze.curNode = newMaze.matrix[newMaze.curNode.depth][newMaze.curNode.height][newMaze.curNode.width];
        newMaze.start = newMaze.matrix[newMaze.start.depth][newMaze.start.height][newMaze.start.width];
        newMaze.end = newMaze.matrix[newMaze.end.depth][newMaze.end.height][newMaze.end.width];

        return newMaze;
    }
    /**
     * reset the matrix to using Cell objects and repopulates neighbors, etc. 
     * necessary because the toString will lose all the functions/ many attributes
     * @param {Array} matrix
     */
    rehydrate(matrix){
        for(let i = 0; i < this.depth; i++){
            for(let j = 0; j < this.height; j++){
                for(let k = 0; k < this.width; k++){
                    let newWalls = matrix[i][j][k].walls;
                    let isStart = matrix[i][j][k].isStart;
                    let isEnd = matrix[i][j][k].isEnd;
                    let curCell = matrix[i][j][k] = new Cell(i, j, k);
                    curCell.walls = newWalls;
                    curCell.isStart = isStart;
                    curCell.isEnd = isEnd;
                    if(i !== 0){
                        curCell.addNeighbor(matrix[i -1][j][k], 0);
                    }
                    if(j !== 0){
                        curCell.addNeighbor(matrix[i][j -1][k], 2);
                    }
                    if(k !== 0){
                        curCell.addNeighbor(matrix[i][j][k - 1], 4);
                    }
                    // set floors on bottom floor, ceilings on top floor
                    if(i === 0){
                        matrix[i][j][k].walls[0] = true;
                    } else if (i === this.depth -1){
                        matrix[i][j][k].walls[1] = true;
                    }
                }
            }
        }
    }

    move(direction) {
        if(Maze3d.directions.has(direction)){
            let dVector = Maze3d.directions.get(direction);
            if(!this.curNode.direction && this.curNode.neighbors[dVector] !== null) {
                this.curNode = this.curNode.neighbors[dVector];
            }
        } 
    }
}

export default Maze3d;