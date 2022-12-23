CREATE DATABASE IF NOT EXISTS inter_valley_quiz_sysdb;

USE inter_valley_quiz_sysdb;

CREATE TABLE IF NOT EXISTS tblGame(
    gameId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    gameDetailsId INT,
    gameIsComplete TINYINT
);

CREATE TABLE IF NOT EXISTS tblGameDetails(
    gameDetailsId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    gameDate DATE,
    gameShift ENUM('1','2','3','4'),
    gameQuizMaster VARCHAR(100),
    gameParticipantTeam1 INT,
    gameParticipantTeam2 INT,
    gameParticipantTeam3 INT,
    gameParticipantTeam4 INT,
    gameParticipantTeam5 INT,
    scoreBoardId INT
);

CREATE TABLE IF NOT EXISTS tblQuestions(
    questionId INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    questionText VARCHAR(500),
    answerText VARCHAR(100),
    gameId INT,
    roundId INT,
    questionNum INT,
    topic VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS tblGameLocate(
    gameId INT PRIMARY KEY NOT NULL,
    gameDay INT,
    gameShift INT,
    gameNumber INT
);
