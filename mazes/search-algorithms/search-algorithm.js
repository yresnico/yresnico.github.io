class SearchAlgorithm{
    constructor(){
        if(this.constructor === SearchAlgorithm){
            throw new Error("Abstract class cannot be instantiated")
        }
        this.stateCount = 0;
    }
    search(searchable){
        if(this.constructor === SearchAlgorithm){
            throw new Error("Abstract method search cannot be instantiated")
        }
    }    
}

export default SearchAlgorithm;
