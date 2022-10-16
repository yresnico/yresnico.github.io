import SearchDemo from "./search-algorithms/search-demo.js";

const demo = new SearchDemo();
const depthField = document.getElementById('depth')
const heightField = document.getElementById('height')
const widthField = document.getElementById('width')
const algSelect = document.getElementById('generation');
const outField = document.getElementById('compareOut');
const compareBtn = document.getElementById('btnCompare')
function runCompare() {
    let algName = algSelect.value;
    let z = depthField.value;
    let y = heightField.value;
    let x = widthField.value;
    let success = demo.setGenerator(algName, z, y, x);
    if(success) {
        outField.innerText = demo.run();
    }
} 

compareBtn.addEventListener('mousedown', e => {
    runCompare()
})

