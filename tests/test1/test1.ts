/*
* This program predicts whether a bit of data repersents an Apple or an Orange
*/

// import the AI Class
import SQAi from '../../SqAI';

// create an instance
const clf = new SQAi();

// feature: [weight, texture:(0 for smooth, 1 for bumpy)]
const features = [[130, 0], [140, 0], [150, 1], [170, 1]];
const labels = ['apple', 'apple', 'orange', 'orange'];

// train the AI
clf.fit(features, labels);

// create the testing data
const testingData = [
    [135, 0], 
    [120, 0], 
    [160, 1], 
    [180, 1],
];

// predict what the testing data is
const prediction = clf.predict(testingData);

// print the prediction and the acuraccy
console.log(prediction);
console.log(
    clf.accuracy(
        prediction, 
        ['apple', 'apple', 'orange', 'orange']
    )
);

/* 
Console Output:
    [ 'apple', 'apple', 'orange', 'orange' ]
    100%
*/