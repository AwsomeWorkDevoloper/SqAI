class SQAi {
    private trainingFeatures: any[] = [];
    private trainingLabels: any[] = [];

    /**
     * Fit function: Trains the AI
     * @param trainingFeatures the training data
     * @param trainingLabels the labels
     */
    public fit(trainingFeatures:any[], trainingLabels:any[]):void {
        // set the training data
        this.trainingFeatures = trainingFeatures;
        this.trainingLabels = trainingLabels;
    }
    
    /**
     * Predict function
     * @param testingFeatures the data we are trying to predict
     * @returns the predicted label
     */

    public predict(testingFeatures:any[]):any[] {
        var predictions:any[] = [];

        var averageFeatures:any = {};

        var indexsOfLabels = this.findAllIndexsOfLabels();

        // get average features

        var labelnames:any[] = [];

        for(let label of this.trainingLabels) {
            if(!labelnames.includes(label)) labelnames.push(label);
        }

        labelnames.forEach(label => {
            var sums:any[] = [];

            indexsOfLabels[`${label}`].forEach((index:any) => {
                if(sums.length === 0) {
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
                var querys:number[] = [];

                labelnames.forEach((label) => {
                    const query = feature - averageFeatures[`${label}`][i];
                    querys.push(query);
                })                

                var closest = this.FindClosestToZero(querys);

                results.push(labelnames[closest.index]);
            }
            predictions.push (this.Mode(results));
        });

        return predictions;
    }

    private findAllIndexsOfLabels():any {
        var indexs:any = {};
        var labelnames:any[] = [];

        for(let label of this.trainingLabels) {
            if(!labelnames.includes(label)) labelnames.push(label);
        }

        for(let labelName of labelnames) {
            indexs[`${labelName}`] = [];

            this.trainingLabels.forEach((x, i) => {
                if(x === labelName) {
                    indexs[`${labelName}`].push(i);
                }
            })
        }

        return indexs;
    }

    private FindClosestToZero(numbers:number[]) {
        let closest = Number.MAX_VALUE;
        let index = 0;

        var nums  = numbers.map(x => Math.abs(x));

        nums.forEach((num, i) => {
            if(num < closest) {
                closest = num;
                index = i;
            }
        })

        return {value: numbers[index], index: index};
    }

    private Mode(array:number[]) {
        if(array.length == 0) return null;

        var modeMap:any = {};
        var maxEl = array[0], maxCount = 1;

        for(var i = 0; i < array.length; i++)
        {
            var el = array[i];
            if(modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;  
            if(modeMap[el] > maxCount)
            {
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

    public accuracy(predictions:any[], labels:any[]) {
        var a = 0;
    
        predictions.forEach((p, i) => {
            if(p === labels[i]) a += 1;
        });
    
        return `${(a / labels.length) * 100}%`;
    }
}

export default SQAi;