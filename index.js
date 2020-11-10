let express = require('express');
let app = express();

app.use('/', express.static('public'));

//Pixar's questions
let quiz = [{
    image : "images/toystory.jpg",
    question : "Toy Story: What is the name of Andy's mean neighbour?",
    options : ["Johnny", "Sid", "Steve","Paul"],
    answer : 1
},{
    image : "images/findingnemo.jpg",
    question : "Finding Nemo: What is the name of Nemo's dad?",
    options : ["Joe", "David", "Kevin","Marlin"],
    answer : 3
},{
    image : "images/walle.jpg",
    question : "Wall-E: What does Wall-E stand for?",
    options : ["World Administation Life Locator Electrical", "Waste Allocation Load Lifter Earth-Class", "Waste Alien Location Lever Electrifier","Weird Alien Love Laughing at Earth"],
    answer : 1
},{
    image : "images/insideout.jpg",
    question : "Inside Out: What is this thououghly reasonable character called",
    options : ["Fear", "Joy", "Sadness","Anger"],
    answer : 3
},{
    image : "images/coco.jpg",
    question : "Coco: What is Miguel's canine companion called?",
    options : ["Rover", "Fang", "Jeff","Dante"],
    answer : 3
},{
    image : "images/onward.jpg",
    question : "Onward: What are the name of these two brothers?",
    options : ["Angus and Malcom Lightfoot", "Duncan and Bruce Lightfoot", "Ian and Barley Lightfoot","Grant and Phil Lightfoot"],
    answer : 2
},{
    image : "images/up.jpg",
    question : "Up: What is the name of the talking dog",
    options : ["Dawg", "Dig", "Dog","Dug"],
    answer : 3
},{
    image : "images/ratatouille.jpg",
    question : "Ratatouille: Which restaurant does Remy secretly work at",
    options : ["La souris", "La nourriture", "Gusteau's","La souricière"],
    answer : 2
},{
    image : "images/monsterinc.jpg",
    question : "Monster, Inc: Who aims to beat Scully as top scarer?",
    options : ["Henry J. WaternooseIII", "Randall Boggs", "Pete 'Claws' Ward","Needleman"],
    answer : 2
},{
    image : "images/brave.jpg",
    question : "Brave: Which country does this story take place?",
    options : ["England", "Ireland", "Wales","Scotland"],
    answer : 3
}];

//store the data about answers
let answer = {
    userName : 'userName',
    total : 0,
    right : 0,
    wrong : 0
};
 
//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io').listen(server);

let input = io.of('/input');
let quizNo = -1;

input.on('connection', (socket) => {
    console.log('input socket connected : ' + socket.id);
    console.log( socket.client.conn.server.clientsCount + " users connected" );
    let totalUser= socket.client.conn.server.clientsCount;
    input.emit('totalUsers', {
        totalUsers : totalUser,
    });

    socket.on('getquestion', () => {
        //send the question to the input client
        let inputdata;
        if (quizNo< 9) {
            quizNo ++;
            inputdata = {
                imageSrc : quiz[quizNo].image,
                question : quiz[quizNo].question,
                options : quiz[quizNo].options,
            };
        }else{
            inputdata = {
                imageSrc : 0,
                question : 0,
                options : 0,
            };
            console.log("quizz is finished");
            input.emit('answers', answer);
            quizNo = 0;
        };

        input.emit('question', inputdata);
    });

    //on receiving answer from the client
    socket.on('answer', (data) => {
        answer.total++;
        if(data.answer == quiz[quizNo].answer) {
            answer.right++;
            socket.emit('answer', {
              answer: true,
              answerNumber: quiz[quizNo].answer
            });
        } else {
            answer.wrong++;
            socket.emit('answer', {
              answer: false,
              answerResponded : data.answer,
              answerNumber: quiz[quizNo].answer
            });
        };
    });

    socket.on('resetData', () => {
        answer.total = 0;
        answer.right = 0;
        answer.wrong = 0;
    });

});


