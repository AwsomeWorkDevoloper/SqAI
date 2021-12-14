import SQAi, { CsvToJSON } from "../../SqAI";
import fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const clf = new SQAi();
const fileContents = fs.readFileSync('test.csv').toString();

const TrainingDataAsJSON = CsvToJSON(fileContents, true);

const words = {
    nice: fs.readFileSync('positive-words.txt')
        .toString().split('\r\n')
        .filter(x => !x.startsWith(';') && x !== ''),
    mean: fs.readFileSync('negative-words.txt')
        .toString().split('\r\n')
        .filter(x => !x.startsWith(';') && x !== '')
};

const GetWordCountInString = (word:string, str:string) => {
    let token = '';
    let count = 0;
    str = str.toLowerCase();
    word = word.toLowerCase();

    str.split('').forEach(ch => {
        if(ch === ' ') return token = '';

        token += ch;

        if(token.startsWith(word)) {
            count++;
            token = '';
        }
    });

    return count;
};

const CreateFeatures = () => {
    const sentences = TrainingDataAsJSON.map(x => x[1]);

    const results:any[] = [];

    sentences.forEach(s => {
        results.push(CreateSentenceFeature(s));
    });

    return results;
}

const CreateSentenceFeature = (s:string) => {
    const res:any[] = [];

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
}

const trainingData = {
    labels: TrainingDataAsJSON.map(x => x[0]),
    features: CreateFeatures()
}

clf.fit(trainingData.features, trainingData.labels);

readline.question('Sentence: ', (s:string) => {
    const testingData = CreateSentenceFeature(s);

    console.log(clf.predict([testingData]));

    readline.close();
});
