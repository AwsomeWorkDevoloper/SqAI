"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SqAI_1 = require("../../SqAI");
const fs = require("fs");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const clf = new SqAI_1.default();
const fileContents = fs.readFileSync('test.csv').toString();
const TrainingDataAsJSON = SqAI_1.CsvToJSON(fileContents, true);
const words = {
    nice: fs.readFileSync('positive-words.txt')
        .toString().split('\r\n')
        .filter(x => !x.startsWith(';') && x !== ''),
    mean: fs.readFileSync('negative-words.txt')
        .toString().split('\r\n')
        .filter(x => !x.startsWith(';') && x !== '')
};
const GetWordCountInString = (word, str) => {
    let token = '';
    let count = 0;
    str = str.toLowerCase();
    word = word.toLowerCase();
    str.split('').forEach(ch => {
        if (ch === ' ')
            return token = '';
        token += ch;
        if (token.startsWith(word)) {
            count++;
            token = '';
        }
    });
    return count;
};
const CreateFeatures = () => {
    const sentences = TrainingDataAsJSON.map(x => x[1]);
    const results = [];
    sentences.forEach(s => {
        results.push(CreateSentenceFeature(s));
    });
    return results;
};
const CreateSentenceFeature = (s) => {
    const res = [];
    let meanWords = 0;
    words.mean.forEach(w => {
        const count = GetWordCountInString(w, s);
        meanWords += count;
    });
    let niceWords = 0;
    words.nice.forEach(w => {
        const count = GetWordCountInString(w, s);
        niceWords += count;
    });
    res.push(niceWords, meanWords);
    return res;
};
const trainingData = {
    labels: TrainingDataAsJSON.map(x => x[0]),
    features: CreateFeatures()
};
clf.fit(trainingData.features, trainingData.labels);
readline.question('Sentence: ', (s) => {
    const testingData = CreateSentenceFeature(s);
    console.log(clf.predict([testingData]));
    readline.close();
});
