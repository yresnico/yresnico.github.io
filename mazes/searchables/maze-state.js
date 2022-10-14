class MazeState extends State {
    constructor(startNode) {
        super(startNode.value);
        this.curNode = startNode;
    }
}