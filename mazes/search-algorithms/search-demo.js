import DFSMaze3dGenerator from "../generation/dfs-maze-3d-generator.js";
import Maze3d from "../generation/maze3d.js";
import Prim3dGenerator from "../generation/prim-3d-generator.js";
import Simple3dGenerator from "../generation/simple-3d-generator.js";
import Maze3dDomain from "../searchables/maze-3d-domain.js";
import AStar from "./astar-algorithm.js";
import BFS from "./bfs-algorithm.js";
import DFS from "./dfs-algorithm.js";

class SearchDemo{
    static algMap = new Map([
        ['Simple', SearchDemo.simpleAlg], ['DFS', SearchDemo.dfsAlg], ['Prim', SearchDemo.primAlg]
    ])

    static simpleAlg(depth, height, width) {
        return new Simple3dGenerator(depth, height, width);
    }

    static dfsAlg(depth, height, width) {
        return new DFSMaze3dGenerator(depth, height, width);
    }

    static primAlg(depth, height, width) {
        return new Prim3dGenerator(depth, height, width);
    }

    constructor() {
        this.mazeGenerator = new Prim3dGenerator(1, 2, 2);
    }

    setGenerator(algName, depth, height, width) {
        if(SearchDemo.algMap.has(algName)) {
            let func = SearchDemo.algMap.get(algName);
            // validate positive values
            if( (!isNaN(depth) && depth > 1) && (!isNaN(height) && height > 1) && (!isNaN(width) && width > 1)) {
                // make sure there are at least 2 cells in the maze for a start and finish
                if(depth >= 2 || width >= 2 || height >= 2) {
                    this.mazeGenerator = func(Math.floor(depth), Math.floor(height), Math.floor(width));
                    return true;
                }
            }
        }
        return false;
    }

    run() {
        const aNewMaze = this.mazeGenerator.generate()
        const copyMaze = new Maze3d(1, 2, 2);
        const copyMaze2 = new Maze3d(1, 2, 2)
        copyMaze.fromMaze3d(aNewMaze);
        copyMaze2.fromMaze3d(aNewMaze);

        let BFSSolver = new BFS(new Maze3dDomain(aNewMaze));
        let bfsSolution = BFSSolver.solve();
        let bfsCount = BFSSolver.stateCount;

        let DFSSolver = new DFS(new Maze3dDomain(copyMaze));
        let DFSSolution = DFSSolver.solve();
        let dfsCount = DFSSolver.stateCount;

        let AStarSolver = new AStar(new Maze3dDomain(copyMaze2));
        let AStarSolution = AStarSolver.solve();
        let astarCount = AStarSolver.stateCount;
        return `BFS states: ${bfsCount}\nDFS states: ${dfsCount}\nA* states: ${astarCount}`;
    }
}
export default SearchDemo;