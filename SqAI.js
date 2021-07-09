"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SQAi {
    constructor() {
        this.trainingFeatures = [];
        this.trainingLabels = [];
    }
    /**
     * Fit function: Trains the AI
     * @param trainingFeatures the training data
     * @param trainingLabels the labels
     */
    fit(trainingFeatures, trainingLabels) {
        // set the training data
        this.trainingFeatures = trainingFeatures;
        this.trainingLabels = trainingLabels;
    }
    /**
     * Predict function
     * @param testingFeatures the data we are trying to predict
     * @returns the predicted label
     */
    predict(testingFeatures) {
        var predictions = [];
        var averageFeatures = {};
        var indexsOfLabels = this.findAllIndexsOfLabels();
        // get average features
        var labelnames = [];
        for (let label of this.trainingLabels) {
            if (!labelnames.includes(label))
                labelnames.push(label);
        }
        labelnames.forEach(label => {
            var sums = [];
            indexsOfLabels[`${label}`].forEach((index) => {
                if (sums.length === 0) {
                    sums = this.trainingFeatures[index];
                }
                else {
                    for (let i = 0; i < sums.length; i++) {
                        sums[i] += this.trainingFeatures[index][i];
                    }
                }
            });
            for (let i = 0; i < sums.length; i++) {
                sums[i] /= indexsOfLabels[`${label}`].length;
            }
            averageFeatures[`${label}`] = sums;
        });
        // predict
        testingFeatures.forEach((row) => {
            var results = [];
            for (let i = 0; i < row.length; i++) {
                const feature = row[i];
                var querys = [];
                labelnames.forEach((label) => {
                    const query = feature - averageFeatures[`${label}`][i];
                    querys.push(query);
                });
                var closest = this.FindClosestToZero(querys);
                results.push(labelnames[closest.index]);
            }
            predictions.push(this.Mode(results));
        });
        return predictions;
    }
    findAllIndexsOfLabels() {
        var indexs = {};
        var labelnames = [];
        for (let label of this.trainingLabels) {
            if (!labelnames.includes(label))
                labelnames.push(label);
        }
        for (let labelName of labelnames) {
            indexs[`${labelName}`] = [];
            this.trainingLabels.forEach((x, i) => {
                if (x === labelName) {
                    indexs[`${labelName}`].push(i);
                }
            });
        }
        return indexs;
    }
    FindClosestToZero(numbers) {
        let closest = Number.MAX_VALUE;
        let index = 0;
        var nums = numbers.map(x => Math.abs(x));
        nums.forEach((num, i) => {
            if (num < closest) {
                closest = num;
                index = i;
            }
        });
        return { value: numbers[index], index: index };
    }
    Mode(array) {
        if (array.length == 0)
            return null;
        var modeMap = {};
        var maxEl = array[0], maxCount = 1;
        for (var i = 0; i < array.length; i++) {
            var el = array[i];
            if (modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;
            if (modeMap[el] > maxCount) {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return maxEl;
    }
    /**
     * Accuracy Function
     * @param predictions the predictions of the ai
     * @param labels the expected results
     * @returns the percentage of accuracy
     */
    accuracy(predictions, labels) {
        var a = 0;
        predictions.forEach((p, i) => {
            if (p === labels[i])
                a += 1;
        });
        return `${(a / labels.length) * 100}%`;
    }
}
exports.default = SQAi;
