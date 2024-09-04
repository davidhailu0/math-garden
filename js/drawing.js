const BACKGROUND_COLOR = '#000000';
const LINE_COLOR = '#FFFFFF'
const LINE_WIDTH = 15

var previousX = 0
var previousY = 0
var currentX = 0
var currentY = 0
var PRESSED = false
var canvas;
var context

function prepareCanvas(){
    canvas = document.getElementById('mycanvas')

    context = canvas.getContext('2d',{willReadFrequently:true})
    context.fillRect(0,0,canvas.clientWidth,canvas.clientHeight)
    context.fillStyle = BACKGROUND_COLOR;
    context.strokeStyle = LINE_COLOR
    context.lineWidth = LINE_WIDTH
    context.lineJoin = 'round'


    canvas.addEventListener('mousedown',function(ev){
        PRESSED = true
        currentX = ev.clientX-canvas.offsetLeft
        currentY = ev.clientY-canvas.offsetTop
    })

    canvas.addEventListener('mouseleave',function(ev){
        PRESSED = false
    })

    document.addEventListener('mouseup',function(ev){
        PRESSED = false
    })

    document.addEventListener('mousemove',function(ev){
        if(PRESSED){
            previousX = currentX
            currentX = ev.clientX - canvas.offsetLeft
            previousY = currentY
            currentY = ev.clientY - canvas.offsetTop

            context.beginPath()
            context.moveTo(previousX,previousY)
            context.lineTo(currentX,currentY)
            context.stroke()
        }
    })

    canvas.addEventListener('touchstart',function(ev){
        PRESSED = true
        currentX = ev.touches[0].clientX-canvas.offsetLeft
        currentY = ev.touches[0].clientY-canvas.offsetTop
    })

    canvas.addEventListener('touchmove',function(ev){
        if(PRESSED){
            previousX = currentX
            currentX = ev.touches[0].clientX - canvas.offsetLeft
            previousY = currentY
            currentY = ev.touches[0].clientY - canvas.offsetTop

            context.beginPath()
            context.moveTo(previousX,previousY)
            context.lineTo(currentX,currentY)
            context.stroke()
        }
    })

    canvas.addEventListener('touchend',function(ev){
        PRESSED = false
    })
}


function clearCanvas(){
    previousX = 0
    previousY = 0
    currentX = 0
    currentY = 0
    context.fillRect(0,0,canvas.clientWidth,canvas.clientHeight)
}