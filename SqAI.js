"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvToJSON = void 0;
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
    predict(testingFeatures, returnProbability = false) {
        let predictions = [];
        let averageFeatures = {};
        let indexsOfLabels = this.findAllIndexsOfLabels();
        // get average features
        let labelnames = [];
        for (let label of this.trainingLabels) {
            if (!labelnames.includes(label))
                labelnames.push(label);
        }
        labelnames.forEach(label => {
            let sums = [];
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
        let probability = [];
        testingFeatures.forEach((row) => {
            let results = [];
            for (let i = 0; i < row.length; i++) {
                const feature = row[i];
                let querys = [];
                labelnames.forEach((label) => {
                    const query = feature - averageFeatures[`${label}`][i];
                    querys.push(query);
                });
                let closest = this.FindClosestToZero(querys);
                results.push(labelnames[closest.index]);
            }
            let [mode, modemap] = this.Mode(results);
            predictions.push(mode);
            probability.push(modemap);
        });
        if (!returnProbability)
            return predictions;
        let finalProbability = [];
        probability.forEach(e => {
            let res = {};
            let total = Number(Object.values(e).reduce((a, b) => a + b, 0));
            for (let item in e) {
                res[`${item}`] = (100 / total) * e[item];
            }
            finalProbability.push(res);
        });
        return [predictions, finalProbability];
    }
    findAllIndexsOfLabels() {
        let indexs = {};
        let labelnames = [];
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
        let nums = numbers.map(x => Math.abs(x));
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
        let modeMap = {};
        let maxEl = array[0], maxCount = 1;
        for (let i = 0; i < array.length; i++) {
            let el = array[i];
            if (modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;
            if (modeMap[el] > maxCount) {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return [maxEl, modeMap];
    }
    /**
     * Accuracy Function
     * @param predictions the predictions of the ai
     * @param labels the expected results
     * @returns the percentage of accuracy
     */
    accuracy(predictions, labels) {
        let a = 0;
        predictions.forEach((p, i) => {
            if (p === labels[i])
                a += 1;
        });
        return `${(a / labels.length) * 100}%`;
    }
}
function CsvToJSON(fileContent, removeFirstRow = false, removeLastRow = false) {
    const result = [];
    const lines = fileContent.split('\n');
    lines.pop();
    lines.forEach((line, i) => {
        if (i === 0 && removeFirstRow)
            return;
        if (i === lines.length && removeLastRow)
            return;
        const cols = line.split(',');
        cols[cols.length - 1] = cols[cols.length - 1].replace(/\r/g, '');
        //result.push(cols.map(x => JSON.parse(x)));
        result.push(cols);
    });
    return result;
}
exports.CsvToJSON = CsvToJSON;
exports.default = SQAi;
