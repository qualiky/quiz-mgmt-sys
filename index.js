// NPM dependencies

const express = require("express");
const ejs = require("ejs");
const mysql2 = require("mysql2");
const path = require("path");
const bodyParser = require("body-parser");
const { appendFile } = require("fs");
const sessions = require("express-session");
const cors = require("cors");
const {getQuestionsFromGameId, getQuestionFromTopic, getQuestionForRapidFire, getQuestionsForTeamRound} = require("./controller/database-controller.js");
var five = require('johnny-five');
var board = new five.Board();
const Question = require("./model/question");

// initialization of necessary global variables
const app = express();

app.use("/static", express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({origin: true, credentials: true}));
app.set('view engine', 'ejs');

var gameDay;
var gameShift;
var gameNumber;
var gameId;




// start the application
app.listen(3000, () => {
    console.log("Server started @ port 3000!");
});

board.on("ready", () => {
    var led = new five.Led(13);
    led.blink(500);
});

var sessionObj;

app.get("/", async(req, res) => {
    sessionObj = req.session;
    res.render("index");
});

app.get("/home", async (req, res) => {
    res.redirect("/");
});

app.get("/games/rounds", (req, res) => {
    console.log("Rounds rendered!");
    res.render("rounds");
});

app.get("/games/rules", (req, res) => {
    console.log("Rules rendered!");
    res.render("rules");
});

app.get("/games/qualifiers", (req, res) => {
    console.log("Qualifiers rendered!");
    res.render("qualifiers");
});

app.post("/games/qualifiers", async (req, res) => {
    console.log(JSON.stringify(req.body));
    gameDay = req.body.gameDay;
    gameShift = req.body.gameShift;
    gameNumber = req.body.gameNumber;
    gameId = gameDay + "" + gameShift + "" + gameNumber;
    res.render("currentgame", {gameDay: gameDay, gameShift: gameShift, gameNumber: gameNumber});
});

app.get("/games/rounds", (req, res) => {
    res.render("currentgame", {gameDay: gameDay, gameShift: gameShift, gameNumber: gameNumber});
});

app.post("/games/quarterfinals", async (req, res) => {
    console.log(JSON.stringify(req.body));
    gameDay = req.body.gameDay;
    gameShift = req.body.gameShift;
    gameNumber = req.body.gameNumber;
    res.render("currentgame_qf", {gameDay: gameDay, gameShift: gameShift, gameNumber: gameNumber});
});

app.post("/games/semifinals", async (req, res) => {
    console.log(JSON.stringify(req.body));
    gameDay = req.body.gameDay;
    gameShift = req.body.gameShift;
    gameNumber = req.body.gameNumber;
    res.render("currentgame_sf", {gameDay: gameDay, gameShift: gameShift, gameNumber: gameNumber});
});

app.get("/games/quarterfinals", (req, res) => {
    console.log("Quarterfinals rendered!");
    res.render("quarterfinals");
});

app.get("/games/semifinals", (req, res) => {
    console.log("Semifinals rendered!");
    res.render("semifinals");
});

app.get("/games/final", (req, res) => {
    console.log("Final rendered!");
    gameDay = 5;
    gameShift = 1;
    gameNumber = 1;
    gameId = parseInt(gameDay + "" + gameShift + "" + gameNumber);
    console.log(gameId);
    res.render("final", {gameDay: gameDay, gameShift: gameShift, gameNumber: gameNumber});
});


/////////////////////////////////////////////////////////////////////////////////////////

app.get("/api/rounds/general", (req, res) => {
    res.render("general", {gameDay: gameDay, gameShift: gameShift, gameNumber: gameNumber});
});

app.get("/api/rounds/general/:questionNum", async (req, res) => {
    var n = req.params.questionNum;
    roundId = 1;
    console.log("Values: " + gameId + ", " + roundId + ", " + n);
    var selectedQuestion = await getQuestionsFromGameId(gameId, roundId, n);
    console.log(selectedQuestion);
    // var selectedTopic = getFullCategoryTitle(selectedQuestion[0].topic);
    var selectedTopic = getFullCategoryTitle(selectedQuestion[0].topic);
    res.render("question_scr", {questionObj: selectedQuestion, selectedTopic: selectedTopic});
});

app.get("/api/rounds/topicselect", (req, res) => {
    roundId = 2;
    res.render("topicselect", {gameDay: gameDay, gameShift: gameShift, gameNumber: gameNumber, topicsCode: topicSelectRounds, completeRoundNames: completeRoundNames});
});

app.get("/api/rounds/topicselect/:roundcode", async (req, res) => {
    var topicVal = req.params.roundcode;
    roundId = 2;
    console.log("Values: " + topicVal + ", " + roundId);
    var selectedQuestion = await getQuestionFromTopic(gameId, roundId, topicVal);
    console.log(selectedQuestion);
    var selectedTopic = getFullCategoryTitle(selectedQuestion[0].topic);
    res.render("question_scr", {questionObj: selectedQuestion, selectedTopic: selectedTopic});
});

app.get("/api/rounds/curriculum", (req, res) => {
    roundId = 3;
    res.render("curriculum", {gameDay: gameDay, gameShift: gameShift, gameNumber: gameNumber});
});

app.get("/api/rounds/curriculum/:questionNum", async (req, res) => {
    var qNum = req.params.questionNum;
    roundId = 3;
    var selectedQuestion = await getQuestionsFromGameId(gameId, roundId, qNum);
    console.log(selectedQuestion);
    var selectedTopic = getFullCategoryTitle(selectedQuestion[0].topic);
    res.render("question_scr", {questionObj: selectedQuestion, selectedTopic: selectedTopic});
});

app.get("/api/rounds/rapidfire", (req, res) => {
    roundId = 5;
    res.render("rapidfire", {gameDay: gameDay, gameShift: gameShift, gameNumber: gameNumber});
});

app.get("/api/rounds/rapidfire/:questionNum", async (req, res) => {
    var qNum = req.params.questionNum;
    roundId = 5;
    var selectedQuestions = await getQuestionForRapidFire(gameId, roundId, qNum);
    console.log(selectedQuestions);
    res.render("question_scr_rf", {questionObjs: selectedQuestions});
});

app.get("/api/rounds/hint", (req, res) => {
    roundId = 6;
    console.log("/api/rounds/hint: " + gameDay + "" + gameShift + "" + gameNumber);
    res.render("hints", {gameDay: gameDay, gameShift: gameShift, gameNumber: gameNumber});
});

app.get("/api/rounds/hints/:questionNum", async (req, res) => {
    var qNum = req.params.questionNum;
    roundId = 6;
    var selectedQuestion = await getQuestionsFromGameId(gameId, roundId, qNum);
    console.log(selectedQuestion);
    var selectedTopic = getFullCategoryTitle(selectedQuestion[0].topic);
    res.render("question_scr_hint", {questionObj: selectedQuestion, selectedTopic: selectedTopic});   
});

app.get("/api/rounds/bullseye", (req, res) => {
    roundId = 7;
    console.log("/api/rounds/bullseye: " + gameDay + "" + gameShift + "" + gameNumber);
    res.render("bullseye", {gameDay: gameDay, gameShift: gameShift, gameNumber: gameNumber});
});

app.get("/api/rounds/bullseye/:questionNum", async (req, res) => {
    var qNum = req.params.questionNum;
    roundId = 7;
    var selectedQuestion = await getQuestionsFromGameId(gameId, roundId, qNum);
    console.log(selectedQuestion);
    var selectedTopic = getFullCategoryTitle(selectedQuestion[0].topic);
    var allAnswers = [selectedQuestion[0].option1, selectedQuestion[0].option2, selectedQuestion[0].option3, selectedQuestion[0].answerText];
    const shuffledAnswers = shuffle(allAnswers);
    console.log(shuffledAnswers);
    res.render("question_scr_options", {questionObj: selectedQuestion, selectedTopic: selectedTopic, shuffledOptions: shuffledAnswers});   
});

app.get("/api/rounds/teamsround", (req, res) => {
    roundId = 8;
    console.log("/api/rounds/teamround: " + gameDay + "" + gameShift + "" + gameNumber);
    res.render("teamsround", {gameDay: gameDay, gameShift: gameShift, gameNumber: gameNumber});
});

app.get("/api/rounds/teamsround/:questionNum", async (req, res) => {
    var qNum = req.params.questionNum;
    roundId = 8;
    var selectedQuestions = await getQuestionsForTeamRound(gameId, roundId, qNum);
    console.log(selectedQuestions);
    res.render("question_scr_team", {questionObjs: selectedQuestions});   
});

//////////////////////////////////////////////////////////////////////////////////////////

var topicSelectRounds = ["GEN", "HIS", "LIT", "GEO", "RCU", "SCT", "SPE", "IQM", "CUA", "AST", "BEC", "COS"];
var completeRoundNames = ["General", "History", "Literature", "Geography", "Religion & Culture", "Science & Technology", "Sports & Entertainment", "IQ & Math", "Current Affairs", "Astronomy", "Business & Economics", "Chamber of Secrets"];

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getFullCategoryTitle (topic) {
    switch(topic) {
        case 'HIS': return 'History';
        break;
        case 'LIT': return 'Literature';
        break;
        case 'GEO': return 'Geography';
        break;
        case 'RCU': return 'Religion & Culture';
        break;
        case 'SCT': return 'Science & Technology';
        break;
        case 'SPE': return 'Sports & Entertainment';
        break;
        case 'IQM': return 'IQ & Math';
        break;
        case 'CUA': return 'Current Affairs';
        break;
        case 'AST': return 'Astronomy';
        break;
        case 'BEC': return 'Business & Economics';
        break;
        case 'GEN': return 'General';
        break;
        case 'COS': return 'Chamber of Secrets';
        break;
    }
}




