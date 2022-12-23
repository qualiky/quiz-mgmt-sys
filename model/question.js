class Question {

    constructor(questionId, questionText, answerText, gameId, roundId, questionNum, topic) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.answerText = answerText;
        this.gameId = gameId;
        this.roundId = roundId;
        this.questionNum = questionNum;
        this.topic = topic;
    }

}

module.exports.Question = Question;