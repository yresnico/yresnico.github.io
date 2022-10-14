import State from "./state.js";

class Maze3dState extends State{

    /**
     * State class utilizing the cell.value as the key
     * @param {Cell} curCell 
     */
    constructor(curCell) {
        super(curCell.value)
        this.curCell = curCell;
    }
    
}
export default Maze3dState