let socket = io('/input');
let isAnswered = false;
let countQ = 0;
let userName = window.prompt('What is your name?', 'JohnDoe');


window.addEventListener('load', () => {
    document.getElementById('get-question').addEventListener('click', () => {
        socket.emit('getquestion');
        console.log('emitting a socket ping');
        console.log(countQ + "time");
        
        if(countQ < 11){
            countQ ++;
            console.log(countQ + 'repeat');  
        }else{
            console.log('restarting the game');

            //reset the data
            countQ = 1;
            socket.emit('resetData');
            document.getElementById('imageResult').style.display = "none";

            //reset the layout
            contentHide();
            contentShow();
        };

        swapLabel();
        changeWidth();
        socket.emit('username');  
        if(countQ == 1 ){
            document.getElementById('answers').innerHTML='';
            createOptionButtons();
        };
    });

    console.log(countQ + "test");
    imageCreation();     
});

//swap the label of the button
function swapLabel(){
    if (countQ == 0) { 
        document.getElementById('start-button').innerHTML = "Start the Quizz";
    } else if (countQ < 10) {
        document.getElementById('start-button').innerHTML = "Next";    
    } else if (countQ == 10){
        document.getElementById('start-button').innerHTML = "Result";
    } else {
        document.getElementById('start-button').innerHTML = "Start Again";
    };
};

//progress bar
function changeWidth(){
    let elemBar = document.getElementById("myBar");
    elemBar.style.width = countQ * 10 +"%";
    console.log(countQ);
};

socket.on('question', (data)=> {
    isAnswered = false;
    console.log(data);
    document.body.style.background = "#ffffff";
    let options = data.options;
    document.getElementById('questions').innerHTML= data.question;

    //reset the bg color of the buttons
    for(let i =0;i<4;i++) {
        document.getElementById("btn"+i).style.backgroundColor = "#ffffff";
    };

    populateOptions(options);
    imageSwap(data.imageSrc); 
});

//change the colour of the button based on answer
socket.on('answer', (data) => {
    console.log('answered');
    let goodAnswer = "btn" + data.answerNumber;
    let badAnswer = "btn" + data.answerResponded;

    if(data.answer === false) {
        console.log(data);
        document.getElementById(goodAnswer).style.backgroundColor = "#62ca7a";
        document.getElementById(badAnswer).style.backgroundColor = "#f33a66";

    } else {
       document.getElementById(goodAnswer).style.backgroundColor = "#62ca7a";
    }
});

socket.on('totalUsers',(data)=> {
    console.log(data.totalUsers);
    document.getElementById('nbrUsers').innerHTML = "There are " + data.totalUsers + " users playing the game!";
});

/* Functions to populate the HTML via javascript */
// function : create the option buttons on page load
function createOptionButtons() {

    for(let i =0;i<4;i++) {
      let button = document.createElement('button');
      let buttonSpan = document.createElement('span');
      buttonSpan.classList.add("button-span");
      button.innerHTML = 1+i;
      button.classList.add("button-options");
      button.setAttribute("id", "btn" + i);

      // when user selects answer
      button.onclick = function() {
          if(isAnswered == false) {
              socket.emit('answer', {answer: i})
              isAnswered = true;
          };
      };

      button.appendChild(buttonSpan);
      document.getElementById('answers').appendChild(button);
    };
};

//function: create the img tag
function imageCreation() {
    let img = document.createElement('img');
    img.classList.add("movie");
    img.src = "images/pixar-logo.png";
    document.getElementById('movie-image').appendChild(img);
};

//function : change the image src when a new question is asked
function imageSwap(imageSrc){
    document.getElementsByClassName('movie')[0].src=imageSrc;    
};

//function : populate the options when question is asked
function populateOptions(options) {
    let optionsElt = document.getElementsByClassName('button-span');
    for(let i=0;i<optionsElt.length;i++ ){
      optionsElt[i].innerHTML = options[i];
    };
};

socket.on('question', (data)=> {
    console.log(data);
    document.getElementById('questions').innerHTML = data.question;    
});

//hide the rest of the content
function contentHide() {
    var x = document.getElementById("content");
    if (x.style.display === "none") {
         x.style.display = "block";
        } else {
        x.style.display = "none";
        };
};

//show the content 
function contentShow() {
    var x = document.getElementsByClassName("answer-container")[0];
    if (x.style.display === "block") {
        x.style.display = "none";
       } else {
       x.style.display = "block";
       };
};

//when the quizz is finished, display answers
socket.on('answers', (data)=> {
    contentHide();
    contentShow();

    console.log(data);
    
    document.getElementById('imageResult').style.display = "flex";

    if(data.right===10){
        document.getElementById('imageResult').innerHTML = "Winner";
        document.getElementById('imageResult').style.background = "#62ca7a";
    }else if (data.right<5){
        document.getElementById('imageResult').innerHTML = "Loser";
        document.getElementById('imageResult').style.background = "#f33a66";
    }else{
        document.getElementById('imageResult').innerHTML = "Train Harder";
        document.getElementById('imageResult').style.background = "#000000";
    };
    
    document.getElementById('userName').innerHTML = "Hello " + userName + ", </br> This is the your results:";
    document.getElementById('answer-total').innerHTML = "Answers replied : " + data.total;
    document.getElementById('answer-right').innerHTML = "Correct answers : " + data.right;
    document.getElementById('answer-wrong').innerHTML = "Wrong answers : " + data.wrong;
});
