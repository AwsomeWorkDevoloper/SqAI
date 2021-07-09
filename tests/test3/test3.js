"use strict";
/*
    This program trys to predict which type of iris flower
    a set of data repersents.
    
    This is a pretty famous dataset in basic ML
*/
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const SqAI_1 = require("../../SqAI");
const fs = require("fs");
// initialize
const clf = new SqAI_1.default();
// read the file contents
const fileContent = fs.readFileSync('iris.csv').toString().split('\r\n');
// create the training data
const trainingData = {
    // turn the filecontents into an array that has the features
    features: () => {
        let features = fileContent.map(x => {
            let f = x.split(',');
            f.pop();
            return f.map(x => parseFloat(x));
        });
        return features;
    },
    // turn the filecontents into an array that has the labels
    labels: () => {
        let labels = fileContent.map(x => {
            let f = x.split(',');
            return f[f.length - 1];
        });
        return labels;
    }
};
// train the ai
clf.fit(trainingData.features(), trainingData.labels());
// create the testing data
const testingData = {
    features: [
        [5.0, 3.6, 1.4, 0.2],
        [5.4, 3.9, 1.7, 0.4],
        [4.6, 3.4, 1.4, 0.3],
        [4.9, 2.4, 3.3, 1.0],
        [5.2, 2.7, 3.9, 1.4],
        [5.0, 2.0, 3.5, 1.0],
        [7.6, 3.0, 6.6, 2.1],
        [7.7, 3.8, 6.7, 2.2],
        [7.7, 2.6, 6.9, 2.3]
    ],
    labels: [
        'setosa',
        'setosa',
        'setosa',
        'versicolor',
        'versicolor',
        'versicolor',
        'virginica',
        'virginica',
        'virginica',
    ]
};
// predict
const prediction = clf.predict(testingData.features);
// print the predictions and the accuracy
console.log(prediction);
console.log(clf.accuracy(prediction, testingData.labels));
/*
    Console Output:
        [
            'setosa',     'setosa',
            'setosa',     'versicolor',
            'versicolor', 'versicolor',
            'virginica',  'virginica',
            'virginica'
        ]
        100%
*/ 
