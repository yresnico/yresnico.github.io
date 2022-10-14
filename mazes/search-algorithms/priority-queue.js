class PriorityQueue {
    #heap
    #comparator
    #top
  
    constructor(comparator = (a, b) => a > b) {
      this.#heap = [];
      this.#comparator = comparator;
      this.#top = 0;
    }
  
    size() {
      return this.#heap.length;
    }
  
    isEmpty() {
      return this.size() == 0;
    }
  
    peek() {
      return this.#heap[this.#top];
    }
  
    push(...values) {
      values.forEach(value => {
        this.#heap.push(value);
        this.#heapifyUp(this.size() - 1);
      });
      return this.size();
    }
  
    pop() {
      const poppedValue = this.peek();
      const bottom = this.size() - 1;
      if (bottom > this.#top) {
        this.#swap(this.#top, bottom);
      }
      this.#heap.pop();
      this.#heapifyDown();
      return poppedValue;
    }
  
    removeByKey(value){
        const index = this.#heap.map(e => e.state.key).indexOf(value);
        if (index != -1) {
            this.#removeAt(index);
          }
    }

    peekByKey(value){
        const index = this.#heap.map(e => e.state.key).indexOf(value);
        if (index != -1) {
            return this.#heap[index]
        }
    }
    
    remove(value) {
      const index = this.#heap.indexOf(value);
      if (index != -1) {
        this.#removeAt(index);
      }
    }
  
    #parent(childIndex) {    
      return Math.floor((childIndex - 1) / 2);
    }
  
    #left(parentIndex) {
      return (parentIndex * 2) + 1;   
    }
  
    #right(parentIndex) {
      return (parentIndex * 2) + 2;
    }
  
    #greater(i, j) {
      return this.#comparator(this.#heap[i], this.#heap[j]);
    }
  
    #swap(i, j) {
      [this.#heap[i], this.#heap[j]] = [this.#heap[j], this.#heap[i]];
    }
  
    #heapifyUp(index) {   
      while (index > this.#top && this.#greater(index, this.#parent(index))) {
        this.#swap(index, this.#parent(index));
        index = this.#parent(index);
      }
    }
  
    #heapifyDown() {
      let index = this.#top;
  
      while (
        (this.#left(index) < this.size() && this.#greater(this.#left(index), index)) ||
        (this.#right(index) < this.size() && this.#greater(this.#right(index), index))
      ) {
        let maxChild = (this.#right(index) < this.size() && this.#greater(this.#right(index), this.#left(index))) ? 
          this.#right(index) : this.#left(index);
        this.#swap(index, maxChild);
        index = maxChild;
      }
    }
  
    #removeAt(index) {
      // Remove the last element and place it at the removed index
      this.#heap[index] = this.#heap.pop();
  
      if (index > this.#top && this.#greater(index, this.#parent(index))) {
        this.#heapifyUp(index);
      } else {
        this.#heapifyDown(index);
      }    
    }
  }
  export default PriorityQueue;