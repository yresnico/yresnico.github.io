import AStar from "../search-algorithms/astar-algorithm.js";
import BFS from "../search-algorithms/bfs-algorithm.js";
import DFS from "../search-algorithms/dfs-algorithm.js";
import Djikstra from "../search-algorithms/djikstra-algorith.js";
import Maze3dDomain from "../searchables/maze-3d-domain.js";

class JSMaze{
    // set up static maps and functions
    static directions = new Map([
        [0, 'above'], [1, 'below'], [2, "up"], [3, "down"], [4, "left"], [5, "right"]
    ])
    
    static namedDirections = new Map([
        ['above', 0], ['below', 1], ["up", 2], ["down", 3], ["left", 4], ["right", 5],
        ['PageUp', 0], ['PageDown', 1], ["ArrowUp", 2], ["ArrowDown", 3], 
        ["ArrowLeft", 4], ["ArrowRight", 5]
    ])

    static reverseDirections = new Map([
        ['above', 'below'], ['below', 'above'], ["up", 'down'], ["down", 'up'], ["left", 'right'], ["right", 'left']
    ])

    static algs = new Map([
        ['BFS', JSMaze.bfsAlg], ['DFS', JSMaze.dfsAlg], ['Djikstra', JSMaze.djikAlg],
        ['AStar', JSMaze.astarAlg]
    ]);

    static bfsAlg(searchable){
        return new BFS(searchable);
    }

    static dfsAlg(searchable){
        return new DFS(searchable);
    }
    
    static djikAlg(searchable) {
        return new Djikstra(searchable);
    }

    static astarAlg(searchable) {
        return new AStar(searchable);
    }

    constructor(container, maze3d, curNode = null){
        this.setCharImagePath("char-icon.png");
        this.container = container;
        this.maze3d = maze3d;
        if(curNode !== null){
            this.curNode = curNode;
        } else {
            this.curNode = maze3d.start;
        }
        this.goalNode = maze3d.end;
        this.solutionStepIdx = 0;
        this.frame = document.getElementById('JSMazeFrame');
        if(!this.frame) {
            this.frame = document.createElement('div')
            this.frame.className ='JSMazeFrame';
            this.container.after(this.frame)
        }
        this.prevFrame = document.getElementById('prevMFrame')
        if(!this.prevFrame) {
            this.prevFrame = document.createElement('div')
            this.prevFrame.id ='prevMFrame';
            this.prevFrame.classList.add('neighborFrame')
            this.frame.before(this.prevFrame)
        }
        this.nextFrame = document.getElementById('nextMFrame')
        if(!this.nextFrame) {
            this.nextFrame = document.createElement('div')
            this.nextFrame.id ='nextMFrame';
            this.nextFrame.classList.add('neighborFrame')
            this.frame.after(this.nextFrame)
        }
        this.initialize();
    }
    /**
     * replace the maze with a new maze, modify image and set up all of the variables for use with it.
     * @param {array} maze3d  list containing the maze and an image path
     * @param {*} curNode 
     */
    //swapMaze(list, curNode = null){
    swapMaze(maze3d) {
        //let maze3d = list[0]
        this.resetMessage();
        //this.setCharImagePath(list[1])
        this.maze3d = maze3d;
        if(maze3d.curNode == null){
            this.maze3d.curNode = this.maze3d.start;
        } 
        this.curNode = this.maze3d.curNode;
        this.goalNode = maze3d.end;
        this.solutionStepIdx = 0;
        this.solution = [];
        this.initialize();
        if(this.curNode.isEnd){
            this.gameOver();
        }
    }

    /** Draw the maze in HTML elements, update the displayed floors, set up the CSS*/
    initialize() {
        this.makeMazeHTML()
        this.container.children[this.curNode.depth].classList.add('currentBoard');
        this.updateFrames();
        this.generateCSS();   
        this.generateNeighborCSS() 
    }

    /** Creates and appends the maze (all floors) and adds to the display:none container */
    makeMazeHTML() {
        for(let i = 0; i < this.maze3d.depth; i++) {
            let board = document.createElement('div');
            board.classList.add('board');
            board.id = `board${i}`;
            for(let j = 0; j< this.maze3d.height; j++) {
                let boardRow = document.createElement('div');
                boardRow.classList.add('mazeRow');
                boardRow.id = `boardRow${i}-${j}`;
                for(let k = 0; k < this.maze3d.width; k++) {
                    let newCell = document.createElement('div');
                    newCell.classList.add('cell');
                    let curCell = this.maze3d.matrix[i][j][k];
                    for(const direction of JSMaze.directions){
                        if(curCell[direction[1]]) {
                            newCell.classList.add(direction[1]);
                        }
                    }
                    if(this.curNode.depth === i){
                        if(this.curNode.height === j) {
                            if (this.curNode.width === k) {
                                newCell.classList.add('current')
                                newCell.style.backgroundImage = `url(${this.charImagePath}`;

                            }
                        }
                    }
                    if(this.goalNode.depth === i){
                        if(this.goalNode.height === j) {
                            if (this.goalNode.width === k) {
                                newCell.classList.add('goal')
                            }
                        }
                    }
                    newCell.textContent = curCell.symbol;
                    boardRow.appendChild(newCell);
                }
                board.appendChild(boardRow);
            }
            this.container.appendChild(board)
        }
    }
    /**
     * Checks if movement is valid- if it is then resets the message area, updates the
     * current location and updates the displayed floors.
     * @param {string} movement 
     * @returns 
     */
    makeMove(movement){
        let movementVector = movement;
        if(JSMaze.namedDirections.has(movement)){
            movementVector = JSMaze.namedDirections.get(movement);
        }
        if(!JSMaze.directions.has(movementVector)){
            return false;
        }
        let direction = JSMaze.directions.get(movementVector);
        if(this.curNode[direction] || this.curNode.neighbors[movementVector] === null){
            this.failMove(movement)
            return false;
        } else {
            this.resetMessage();
            this.updateCurrent(movementVector)
            this.updateFrames();
            this.generateNeighborCSS() 
        }
    }
    //attempt to animate bumping into walls. Currently not working
    failMove(movement){
        let self;
        switch(movement){
            case 'ArrowRight':
                this.frame.children[0].children[this.curNode.height].children[this.curNode.width].classList.add('bouncingRight');
                self = this;
                setTimeout(() => self.frame.children[0].children[self.curNode.height].children[self.curNode.width].classList.remove('bouncingRight'), 500);
                break;
            case 'ArrowLeft':
                this.frame.children[0].children[this.curNode.height].children[this.curNode.width].classList.add('bouncingLeft');
                self = this;
                setTimeout(() => self.frame.children[0].children[self.curNode.height].children[self.curNode.width].classList.remove('bouncingLeft'), 500);
                break;
            case 'ArrowUp':
                this.frame.children[0].children[this.curNode.height].children[this.curNode.width].classList.add('bouncingUp');
                self = this;
                setTimeout(() => self.frame.children[0].children[self.curNode.height].children[self.curNode.width].classList.remove('bouncingUp'), 500);
                break;
            case 'ArrowDown':
                this.frame.children[0].children[this.curNode.height].children[this.curNode.width].classList.add('bouncingDown');
                self = this;
                setTimeout(() => self.frame.children[0].children[self.curNode.height].children[self.curNode.width].classList.remove('bouncingDown'), 500);
                break;
            default:
                break;
        }
    }
    /** For use on move or maze generation, clear the message  */
    resetMessage() {
        const mCont = document.getElementById('mazeMessage')
        if(mCont) {
            mCont.textContent = '';
        }
    }


    /** Update the current node, board and maze */
    updateCurrent(movementVector) {
        this.container.children[this.curNode.depth].classList.remove('currentBoard');
        this.container.children[this.curNode.depth].children[this.curNode.height].children[this.curNode.width].classList.remove('current');
        this.container.children[this.curNode.depth].children[this.curNode.height].children[this.curNode.width].style.backgroundImage = '';
        if(this.gameWon) {
            this.container.children[this.curNode.depth].children[this.curNode.height].children[this.curNode.width].classList.remove('InGoal');
            this.gameWon = false;
        }
        this.curNode = this.curNode.neighbors[movementVector];
        this.maze3d.curNode = this.curNode;
        this.container.children[this.curNode.depth].classList.add('currentBoard');
        this.container.children[this.curNode.depth].children[this.curNode.height].children[this.curNode.width].classList.add('current');
        this.container.children[this.curNode.depth].children[this.curNode.height].children[this.curNode.width].style.backgroundImage = `url(${this.charImagePath}`;

        if(this.curNode.isEnd){
            this.gameOver();
        }
    }

    /** Update the displayed boards */
    updateFrames() {
        this.prevFrame.innerHTML = '';
        let prevNeighbor = this.container.children[this.curNode.depth].previousElementSibling;
        if(prevNeighbor){
            let prevClone = prevNeighbor.cloneNode(true);
            this.prevFrame.appendChild(prevClone);
        }
        this.nextFrame.innerHTML = '';
        let nextNeighbor = this.container.children[this.curNode.depth].nextElementSibling
        if(nextNeighbor){
            let nextClone = nextNeighbor.cloneNode(true);
            this.nextFrame.appendChild(nextClone);
        }
        let resident = this.container.children[this.curNode.depth]
        let clone = resident.cloneNode(true);
        clone.classList.add('framed')
        this.frame.innerHTML = '';
        this.frame.appendChild(clone);
    }
    //function meant to reduce code in the updateFrames function. Not completed in time
    frameClone(element, toBeCopied, classToAdd) {
        let clone = toBeCopied.cloneNode(true);
        clone.classList.add(classToAdd);
        element.appendChild(clone)
    }
    // Display the game over announcement. May change in future if a time/move limit is added
    gameOver(){
        this.gameWon = true;
        this.container.children[this.curNode.depth].children[this.curNode.height].children[this.curNode.width].classList.add('InGoal');
        const MESSAGE = 'Congratulations, you have reached the end of the maze!'
        
        const mCont = document.getElementById('mazeMessage')
        if ( !mCont ) {
            document.createElement('h2');
            this.container.appendChild(mCont);
        }
        mCont.textContent = MESSAGE;
        mCont.className = 'announcement'
    }
    // Solves the maze using the named algorithm
    getSolution(algName){
        let alg;
        if ( JSMaze.algs.has(algName) ) {
            let algType = JSMaze.algs.get(algName);
            alg = algType(new Maze3dDomain(this.maze3d));
        }
        return alg.solve();
    }
    // Solves the maze and moves the player along it to the end. Speed of animation is in the last line
    animateSolution(algName){
        this.solution = this.getSolution(algName);
        this.solutionStepIdx = 0;
        let solutionMove = this.makeSolutionMove.bind(this);
        this.interval = setInterval(() => {solutionMove()}, 500);
    }

    // Gets the solution and temporarily moves the player one step into it. May change in future to just css modification and flashing the new location instead of actually moving and moving back
    showHint(algName){
        this.solution = this.getSolution(algName);
        this.solutionStepIdx = 0;
        let oneStep = this.solution[0]
        if(JSMaze.reverseDirections.has(oneStep)){
            let reverseMove = JSMaze.reverseDirections.get(oneStep);
            this.makeMove(oneStep);
            let undo = this.makeMove.bind(this);
            setTimeout(() => {undo(reverseMove)}, 1000);
        }
    }
    // function for moving one step along the solution. utilized only for the animate solution function at the moment.
    makeSolutionMove(){
        this.makeMove(this.solution[this.solutionStepIdx]);
        this.solutionStepIdx++;
        if(this.solutionStepIdx === this.solution.length){
            clearInterval(this.interval);
        }
    }

    // function to generate the css for the frame and cell height and width,
    generateCSS() {

        let mainFrameWidth = this.frame.clientWidth;
        this.frame.style.height = mainFrameWidth + 'px';
        let possibleWidth = Math.floor(mainFrameWidth / this.maze3d.width);
        let columnTemplateStr = ''
        let DEFINEDCOLUMN = possibleWidth + 'px ';
        for(let i = 0; i < this.maze3d.width; i++){
            columnTemplateStr += DEFINEDCOLUMN;
        }
        let rowList = document.getElementsByClassName('mazeRow');
        for(let row of rowList){
            row.style.display = 'grid';
            row.style.gridTemplateRows = DEFINEDCOLUMN;
            row.style.gridTemplateColumns = columnTemplateStr;

        }
        
        let allCells = document.querySelectorAll('.cell')
        for(let cell of allCells) {
            cell.style.fontSize = (possibleWidth *.5 +'px');
        }

    }
    // generates the same for the neighbor boards
    generateNeighborCSS() {
        let mainFrameHeight = this.frame.clientHeight;
        this.prevFrame.style.height = mainFrameHeight + 'px';
        this.nextFrame.style.height = mainFrameHeight + 'px';
        let curNeighborWidth = this.prevFrame.clientWidth;
        let possibleWidth = Math.floor(curNeighborWidth / this.maze3d.width);
        let neighborCells = document.querySelectorAll('.neighborFrame .cell');
        for(let cell of neighborCells) {
            cell.setAttribute('width', (possibleWidth+'px'));
            cell.setAttribute('height', (possibleWidth+'px'));
        }
        let frameCells = document.querySelectorAll('.framed .cell')
    }
    // sets character image for current cell display
    setCharImagePath(filePath) {
        this.charImagePath = filePath;
    }
}

export default JSMaze;