const mysql2 = require("mysql2/promise");
const Question = require("../model/question");


exports.getQuestionsFromGameId = async (gameId, roundId, questionNum) => {

    var selectQuestionsFromParams = `
    SELECT * FROM tblQuestions WHERE
    gameId = ?
    AND
    roundId = ?
    AND
    questionNum = ?
    `;

    try {
        const [rows, fields] = await (await connnection()).execute(selectQuestionsFromParams, [gameId, roundId, questionNum]);
        console.log("Response: " + JSON.stringify(rows));
        return rows;
    } catch(e) {
        console.log(e);
    }
}

exports.getQuestionFromTopic = async (gameId, roundId, topicVal) => {
    var selectQuestionsFromParams = `
    SELECT * FROM tblQuestions WHERE
    gameId = ?
    AND
    roundId = ?
    AND
    topic = ?
    `;

    try {
        const [rows, fields] = await (await connnection()).execute(selectQuestionsFromParams, [gameId, roundId, topicVal]);
        console.log("Response: " + JSON.stringify(rows));
        return rows;
    } catch(e) {
        console.log(e);
    }
}

exports.getQuestionForRapidFire = async (gameId, roundId, starterNum) => {
    var selectQuestionsFromParams = `
    SELECT * FROM tblQuestions WHERE
    gameId = ?
    AND
    roundId = ?
    AND
    (questionNum <= ? * 10)
    ORDER BY questionNum DESC LIMIT 10
    `;

    try {
        const [rows, fields] = await (await connnection()).execute(selectQuestionsFromParams, [gameId, roundId, starterNum]);
        console.log("Response: " + JSON.stringify(rows));
        return rows;
    } catch(e) {
        console.log(e);
    }
}

exports.getQuestionsForTeamRound = async (gameId, roundId, starterNum) => {
    var selectQuestionsFromParams = `
    SELECT * FROM tblQuestions WHERE
    gameId = ?
    AND
    roundId = ?
    AND
    (questionNum <= ? * 3)
    ORDER BY questionNum DESC LIMIT 3
    `;

    try {
        const [rows, fields] = await (await connnection()).execute(selectQuestionsFromParams, [gameId, roundId, starterNum]);
        console.log("Response: " + JSON.stringify(rows));
        return rows;
    } catch(e) {
        console.log(e);
    }
}




async function connnection() {
    return await mysql2.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "Root_123",
        database: 'inter_valley_quiz_sysdb'
    });
}