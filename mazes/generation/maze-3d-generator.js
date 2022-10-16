import Maze3d from "./maze3d.js";
/** abstract generator class for Maze3d, with the measurement method already instantiated */
class Maze3dGenerator{
    constructor(depth, height, width) {
        if(this.constructor === Maze3dGenerator){
            throw new Error("Abstract class cannot be instantiated");
        }
    }

    generate() {
        if(this.constructor === Maze3dGenerator){
            throw new Error("Abstract method must be instantiated)");
        }
    }

    measureAlgorithmTime() {
        let start = Date.now();
        let board = this.generate();
        let end = Date.now();
        return `Elapsed time was ${end - start}ms`;
    }
}
export default Maze3dGenerator;