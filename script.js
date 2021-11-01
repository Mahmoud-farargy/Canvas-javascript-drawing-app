"use strict";
// selectors
const c = document.getElementById("mainCanvas");
const undoBtn = document.getElementById("undoBtn");
const clearBtn = document.getElementById("clearBtn");
const toolBox = document.querySelector(".tool-box");
const colorPicker = document.getElementById("colorPicker");
const fontSizeController = document.getElementById("fontController");
const extractCanvas = document.getElementById("extractCanvas");
const fontSizeVal = document.getElementById("fontSizeValue");

// states
const ctx = c.getContext("2d");
let isPressed = false;
let color = "black";
let size = 5;
let restoredArray = [];
let isColorPickerOpen = false;
const startBackgroundColor = "#fafafa";
const canvasWidth = window.innerWidth - 10;
toolBox.style.width = `${canvasWidth}px`;
const canvasHeight = 600;
// initiators
c.width = canvasWidth;
c.height = canvasHeight;
c.style.width = `${canvasWidth}px`;
c.style.height = `${canvasHeight}px`;
fontSizeController.value = 10;

const updateBtnsState = (arr) => {
    let isCanvasNotEmpty = arr.length > 0;
    if(isCanvasNotEmpty){
        clearBtn.classList.remove("disabled");
        undoBtn.classList.remove("disabled");
        extractCanvas.classList.remove("disabled");
    }else{
        clearBtn.classList.add("disabled");
        undoBtn.classList.add("disabled");
        extractCanvas.classList.add("disabled");
    }
  
}

// start position
const startPostition = (e) => {
    e.preventDefault();
    isPressed = true;
    ctx.beginPath();
    drawLine(e);
}

// end event
const finishPosition = (e) => {
    if(e.type !== "mouseout"){
        restoredArray.push(ctx.getImageData(0, 0, c.width, c.height));
        updateBtnsState(restoredArray);
    }
    if(!isPressed) return;
    e.preventDefault();
    
    isPressed = false;
    ctx.stroke();
    ctx.closePath();
}

// drawing position
const drawLine = (e) => {
    e.preventDefault();
    if(isPressed){
        const x = e.clientX - c.offsetLeft;
        const y = e.clientY - c.offsetTop;
        ctx.lineTo(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.moveTo(x, y);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    }
}
function onColorChange (e) {
    color = e.target.value;
}
function clearCanvas () {
    size = 5;
    fontSizeController.value = 10;
    ctx.fillStyle = startBackgroundColor;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillRect(0, 0, c.width, c.height);
    restoredArray = [];
    updateBtnsState(restoredArray);
}
function onClearCanvas () {
    if(confirm("Are you sure you want to clear Canvas?")){
        clearCanvas();
    }
}
function handlePickerFocusness (val){
    isColorPickerOpen = val;
}
function onFontChange(e){
    const newVal = Number(e.target.value);
    if(newVal >= 0 && newVal <= 100){
      const dividedVal = newVal/ 2;
      size = dividedVal;
      fontSizeVal.innerText = Math.floor(dividedVal);
    }
}
function onUndoingClick(){

    if(restoredArray.length <= 1 ){
        clearCanvas();
    }else{
        restoredArray.pop();
        updateBtnsState(restoredArray);
        ctx.putImageData(restoredArray[restoredArray.length -1], 0, 0);
    }
}
function onCanvasExtraction() {
    extractCanvas.setAttribute("href", c.toDataURL());
}

// events handlers
colorPicker.addEventListener("input", onColorChange, false);
colorPicker.addEventListener("focus", function(){
    handlePickerFocusness(true);
}, false);
colorPicker.addEventListener("blur", function(){
    handlePickerFocusness(false);
}, false);
clearBtn.addEventListener("click", onClearCanvas, false);
fontSizeController.addEventListener("input", onFontChange,false);
undoBtn.addEventListener("click", onUndoingClick, false);
extractCanvas.addEventListener("click", onCanvasExtraction, false);
c.addEventListener("mousedown", startPostition, false);
c.addEventListener("touchstart", startPostition, false);
c.addEventListener("mouseup", finishPosition, false);
c.addEventListener("mouseout", finishPosition, false);
c.addEventListener("touchend", finishPosition, false);
c.addEventListener("mousemove", drawLine,false);
c.addEventListener("touchmove", drawLine,false);
