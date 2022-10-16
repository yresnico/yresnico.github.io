import Maze3d from "./generation/maze3d";
import Prim3dGenerator from "./generation/prim-3d-generator";
import AStar from "./search-algorithms/astar-algorithm";
import BFS from "./search-algorithms/bfs-algorithm";
import DFS from "./search-algorithms/dfs-algorithm";
import Djikstra from "./search-algorithms/djikstra-algorith";
import Maze3dDomain from "./searchables/maze-3d-domain";

const newMazeGenerator = new Prim3dGenerator(1, 2, 2);
const newMaze = newMazeGenerator.generate();
let startNode = newMaze.start;
let endNode = newMaze.end;

// for each search alg the test will copy the maze, get the solution and then move along it. Tests whether the solution worked. 

test('BFSSolverWorkingExample', () => {
    let copyMaze = new Maze3d();
    copyMaze.fromMaze3d(newMaze)
    const bfsSolver = new BFS(new Maze3dDomain(copyMaze));
    const solution = bfsSolver.solve();
    for(const move of solution){
        copyMaze.move(move);
    }
    expect(copyMaze.curNode.value === newMaze.end.value).toBe(true);
})

test('DFSSolverWorkingExample', () => {
    let copyMaze = new Maze3d();
    copyMaze.fromMaze3d(newMaze)
    const dfsSolver = new DFS(new Maze3dDomain(copyMaze));
    const solution = dfsSolver.solve();
    for(const move of solution){
        copyMaze.move(move);
    }
    expect(copyMaze.curNode.value === newMaze.end.value).toBe(true);
})

test('DjikSolverWorkingExample', () => {
    let copyMaze = new Maze3d();
    copyMaze.fromMaze3d(newMaze)
    const djikSolver = new Djikstra(new Maze3dDomain(copyMaze));
    const solution = djikSolver.solve();
    for(const move of solution) {
        copyMaze.move(move);
    }
    expect(copyMaze.curNode.value === newMaze.end.value).toBe(true);
})

test('AstarSolverWorkingExample', () => {
    let copyMaze = new Maze3d();
    copyMaze.fromMaze3d(newMaze)
    const astarSolver = new AStar(new Maze3dDomain(copyMaze));
    const solution = astarSolver.solve();
    for(const move of solution) {
        copyMaze.move(move);
    }
    expect(copyMaze.curNode.value === newMaze.end.value).toBe(true);
})