function shuffle(arr){
    for(let i = 0; i < arr.length; i++){
        let j = Math.floor(Math.random() * arr.length);
        if(j !== i){
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
}
export default shuffle;