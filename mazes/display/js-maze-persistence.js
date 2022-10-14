class JSMazePersistence{
    static saved = new Map();
    constructor(){
    }
    save(name, jsmaze){
        console.log(JSON.stringify(jsmaze.maze3d));
        JSMazePersistence.saved.set(name, JSON.stringify(jsmaze.maze3d));
    }
    load(name){
        if(!JSMazePersistence.saved.has(name)){
            throw new Error(`Maze ${name} not found`);
        } else {
            return JSON.parse(JSMazePersistence.saved.get(name));
        }
    }
}

export default JSMazePersistence;