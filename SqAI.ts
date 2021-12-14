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

    public predict(testingFeatures:any[], returnProbability:boolean = false):any[] {
        let predictions:any[] = [];

        let averageFeatures:any = {};

        let indexsOfLabels = this.findAllIndexsOfLabels();

        // get average features

        let labelnames:any[] = [];

        for(let label of this.trainingLabels) {
            if(!labelnames.includes(label)) labelnames.push(label);
        }

        labelnames.forEach(label => {
            let sums:any[] = [];

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
        let probability:any[] = [];
        testingFeatures.forEach((row) => {
            let results = [];
            for (let i = 0; i < row.length; i++) {
                const feature = row[i];
                let querys:number[] = [];
                
                labelnames.forEach((label) => {
                    const query = feature - averageFeatures[`${label}`][i];
                    
                    querys.push(query);
                })
                
                let closest = this.FindClosestToZero(querys);

                results.push(labelnames[closest.index]);
            }
            let [mode, modemap] = this.Mode(results);
            predictions.push(mode);
            probability.push(modemap);
        });

        if(!returnProbability) return predictions;
        
        let finalProbability:any[] = [];

        probability.forEach(e => {
            let res:any = {};
            let total:number = Number(Object.values(e).reduce((a:any, b:any) => a+b, 0));

            for(let item in e) {
                res[`${item}`] = (100/total)*e[item];
            }

            finalProbability.push(res);
        });

        return [predictions, finalProbability];
    }

    private findAllIndexsOfLabels():any {
        let indexs:any = {};
        let labelnames:any[] = [];

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

        let nums  = numbers.map(x => Math.abs(x));

        nums.forEach((num, i) => {
            if(num < closest) {
                closest = num;
                index = i;
            }
        })

        return {value: numbers[index], index: index};
    }

    private Mode(array:number[]):any {
        if(array.length == 0) return null;

        let modeMap:any = {};
        let maxEl = array[0], maxCount = 1;

        for(let i = 0; i < array.length; i++)
        {
            let el = array[i];
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

        return [maxEl, modeMap];
    }

    /**
     * Accuracy Function
     * @param predictions the predictions of the ai
     * @param labels the expected results
     * @returns the percentage of accuracy
     */

    public accuracy(predictions:any[], labels:any[]) {
        let a = 0;
    
        predictions.forEach((p, i) => {
            if(p === labels[i]) a += 1;
        });
    
        return `${(a / labels.length) * 100}%`;
    }
}

function CsvToJSON (fileContent:string, removeFirstRow=false, removeLastRow=false) {
    const result:any[] = [];
    const lines = fileContent.split('\n');

    lines.pop();

    lines.forEach((line:string, i:number) => {
        if(i === 0 && removeFirstRow) return;
        if(i === lines.length && removeLastRow) return;

        const cols = line.split(',');

        cols[cols.length - 1] = cols[cols.length - 1].replace(/\r/g, '');

        //result.push(cols.map(x => JSON.parse(x)));
        result.push(cols);
    });

    return result;
}


export default SQAi;
export { CsvToJSON };