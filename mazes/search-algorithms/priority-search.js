import PriorityQueue from "./priority-queue.js";
import SearchAlgorithm from "./search-algorithm.js";

class PrioritySearch extends SearchAlgorithm{
    constructor(comparitor){
        super();
        this.queue = new PriorityQueue(comparitor);
    }
}
export default PrioritySearch;