var answer;
var score = 0;
var backgroundImage = [];

function nextQuestion(){
    const n1 = Math.round(Math.random()*4)
    const n2 = Math.round(Math.random()*4)
    document.getElementById('n1').textContent = n1
    document.getElementById('n2').textContent = n2
    answer = n1 + n2;
}

async function checkAnswer(){
    const pred = await predictImage()
    console.log(answer,pred)
    if(pred==answer){
        score++;
        if(score<7){
            let image = `url('images/background${score}.svg')`
            backgroundImage.push(image)
        }
        else{
            alert("Congratulations, You won the contest")
            backgroundImage = []
            score = 0;
        }
    }
    else if(score!=0){
        score--;
        backgroundImage.pop()
    }
    document.body.style.backgroundImage = backgroundImage
}