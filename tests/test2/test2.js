"use strict";
/**
 * This program predicts whether a set of data is a baby, a kid, a teen, or an adult
 */
Object.defineProperty(exports, "__esModule", { value: true });
// import ai class
const SqAI_1 = require("../../SqAI");
// initialize
const clf = new SqAI_1.default();
// create training data, the more the better
const trainingData = {
    features: [
        // height(cm), weight(kg), vocabulary(amount of words known)
        [40, 8.9, 30],
        [31, 7, 21],
        [41, 8.2, 40],
        [120, 22.9, 1500],
        [113, 20, 1205],
        [112, 25, 1352],
        [170, 56, 13000],
        [168, 59, 14302],
        [172, 61, 15230],
        [182, 90.7, 20500],
        [192, 98.2, 28000],
        [176, 86, 23520]
    ],
    labels: [
        'baby',
        'baby',
        'baby',
        'kid',
        'kid',
        'kid',
        'teen',
        'teen',
        'teen',
        'adult',
        'adult',
        'adult',
    ]
};
// train the ai
clf.fit(trainingData.features, trainingData.labels);
// create the testing data
const testingData = {
    features: [
        [51, 9.2, 52],
        [103, 19, 1100],
        [162, 52, 12000],
        [196, 81, 18000]
    ],
    labels: [
        'baby',
        'kid',
        'teen',
        'adult'
    ]
};
// let the ai predict
const prediction = clf.predict(testingData.features);
// print the prediction, and the accuracy of it
console.log(prediction);
console.log(clf.accuracy(prediction, testingData.labels));
/*
    Console Output:
        [ 'baby', 'kid', 'teen', 'adult' ]
        100%
*/ 
