import DFSMaze3dGenerator from "../generation/dfs-maze-3d-generator.js";
import Maze3d from "../generation/maze3d.js";
import Prim3dGenerator from "../generation/prim-3d-generator.js";
import Simple3dGenerator from "../generation/simple-3d-generator.js";
import Maze3dDomain from "../searchables/maze-3d-domain.js";
import BFS from "./bfs-algorithm.js";
import DFS from "./dfs-algorithm.js";

class SearchDemo{
    constructor(depth, height, width){
        this.mazeGenerator = new Prim3dGenerator(depth, height, width);
    }
    run() {
        const aNewMaze = this.mazeGenerator.generate()
        const copyMaze = new Maze3d(1, 2, 2);
        copyMaze.fromMaze3d(aNewMaze);
        console.log(copyMaze.toString());
        console.log(aNewMaze.toString());
        let BFSSolver = new BFS(new Maze3dDomain(aNewMaze));
        let bfsSolution = BFSSolver.solve();
        let bfsCount = BFSSolver.stateCount;
        let DFSSolver = new DFS(new Maze3dDomain(copyMaze));
        let DFSSolution = DFSSolver.solve();
        let dfsCount = DFSSolver.stateCount;
        return `BFS states: ${bfsCount}\nDFS states: ${dfsCount}`;
    }
}
export default SearchDemo;