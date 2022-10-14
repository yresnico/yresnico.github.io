class Cell{
    static sides = 6;
    static wallMap = new Map([[0, 1],[1, 0], [2, 3], [3, 2], [4, 5], [5, 4]]);
    #value
    #walls
    #neighbors
    #isStart
    #isEnd
    constructor(z, h, w, defaultWallNumber = 0) {
        this.value = [z, h, w].toString(); 
        this.depth = z;
        this.height = h;
        this.width = w;
        this.walls = [true, true, true, true, true, true]
        this.neighbors = [null, null, null, null, null, null];
        this.isStart = false;
        this.isEnd = false;
        //this.generateRandomWalls(defaultWallNumber);
    }

    get value() {
        return this.#value;
    }

    set value(text) {
        this.#value = text;
    }

    get walls() {
        return this.#walls;
    }

    set walls(val) {
        this.#walls = val;
    }
    
    get neighbors() {
        return this.#neighbors;
    }
    
    set neighbors(val) {
        this.#neighbors = val;
    }
    
    get visitableNeighbors() {
        let result = []
        for(let i = 0; i < Cell.sides; i++){
            if(!this.#walls[i]){
                result.push(this.neighbors[i]);
            }
        }
        return result;
    }

    get aboveWall() {
        return this.walls[0];
    }

    get bottomWall() {
        return this.walls[1];
    }

    get upWall() {
        return this.walls[2]
    }

    get downWall() {
        return this.walls[3]
    }

    get rightWall() {
        return this.walls[4]
    }

    get leftWall() {
        return this.walls[5]
    }

    set isStart(val) {
        if(val){
            if(this.#isEnd){
                throw new Error("Start cannot be end")
            }
        }        
        this.#isStart = val;
    }

    get isStart() {
        return this.#isStart;
    }

    set isEnd(val) {
        if(val){
            if(this.isStart){
                throw new Error("End cannot be start");
            }
        }       
        this.#isEnd = val;
    }
    get isEnd() {
        return this.#isEnd;
    }

    makeStart() {
        this.isStart = true;
    }

    makeEnd() {
        if(this.wallCount >= 5) {
            try {
                this.isEnd = true;

            } catch (error) {
                return false;
            }
            return true;
        }
        return false;
    }

    get symbol() {
        if(this.isStart) {
            return 'S';
        }
        if(this.isEnd) {
            return 'G';
        }
        if(this.walls[0] && this.walls[1]) {
            return '\u0020';
        } else if (this.walls[0]) {
            return '\u2193';
        } else if(this.walls[1]) {
            return '\u2191';
        } else{
            return '\u2195';
        }
    }
    
    get rightWalled() {
        return this.walls[5];
    }
    
    addNeighbor(cell, index) {
        if(index !== undefined) {
            this.neighbors[index] = cell;
            cell.neighbors[index + 1] = this;
        } else {
            this.neighbors.push(cell);
        }
    }

    generateRandomWalls(num) {
        for(let i = 0; i < num; i++) {
            let idx = Math.floor(Math.random() * Cell.sides);
            if(!this.walls[idx] && this.neighbors[idx]) {
                this.addWall(idx);
            }
        }
    }
    openRandomWalls(num) {
        for(let i = 0; i < num; i++) {
            let idx = Math.floor(Math.random()* Cell.sides);
            if(this.walls[idx] && this.neighbors[idx]) {
                this.hammer(this.neighbors[idx]);
            }
        }
    }
    addWall(i) {
        if(this.neighbors[i]) {
            this.neighbors[i].walls[Cell.wallMap.get(i)] = true;
            this.walls[i] = true;
        }
    }
    hammer(cell) {
        let idx = this.neighbors.findIndex(c => {if(c !== null) {return c.value === cell.value} else return false});
        if(idx > - 1) {
            this.walls[idx] = false;
            this.neighbors[idx].walls[Cell.wallMap.get(idx)] = false;
        }
    }
    get availableNeighbors() {
        let result = [];
        for(let neighbor of this.neighbors) {
            if(neighbor !== null && neighbor.wallCount === 6) {
                result.push(neighbor);
            }
        }
        return result;
    }
    get wallCount() {
        let count = 0;
        for(const wall of this.walls) {
            if(wall) {
                count++;
            }
        }
        return count;
    }
    toString() {
        //return ` ${this.symbol} ${this.rightWalled ? '|' : ' '}`
        return `${this.symbol}`;
    }   

    get above() {
        return (this.neighbors[0] !== null && this.walls[0]);
    }

    get below() {
        return (this.neighbors[1] !== null && this.walls[1]);
    }

    get up() {
        return (this.neighbors[2] !== null && this.walls[2]);
    }

    get down() {
        return (this.neighbors[3] !== null && this.walls[3]);
    }

    get left() {
        return (this.neighbors[4] !== null && this.walls[4]);
    }

    get right() {
        return (this.neighbors[5] !== null && this.walls[5]);
    }

    toJSON() {
        let newObj = {}
        newObj.value = this.#value; 
        newObj.depth = this.depth;
        newObj.height = this.height;
        newObj.width = this.width;
        newObj.walls = this.#walls;
        //newObj.neighbors = this.#neighbors;
        newObj.isStart = this.#isStart;
        newObj.isEnd = this.#isEnd;
        return newObj;
    }
    static fromStorage(storageObj){
        let newCell = new Cell(storageObj.depth, storageObj.height, storageObj.width);
        newCell.value = storageObj.value;
        newCell.walls = storageObj.walls;
        newCell.neighbors = storageObj.neighbors;
        newCell.isStart = storageObj.isStart;
        newCell.isEnd = storageObj.isEnd;
        return newCell;
    }
    
}

export default Cell;