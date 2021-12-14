import express = require('express');
import fs = require('fs');
import SQAi from '../../SqAI';
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/addtest', (req, res) => {
    const body = req.body;

    const oldData = JSON.parse(fs.readFileSync('trainingData.json').toString());

    oldData.features.push(body.data);
    oldData.labels.push(body.label);

    fs.writeFileSync('trainingData.json', JSON.stringify(oldData));

    res.status(200).json({"result": "ok"});
});

app.post('/predict', (req, res) => {
    const features = req.body.features;

    const training = JSON.parse(fs.readFileSync('trainingData.json').toString());

    const clf = new SQAi();

    clf.fit(training.features, training.labels);

    let [prediction, probability] = clf.predict([features], true);

    console.log(probability);

    res.status(200).json({prediction, probability});
});

app.listen(5000, () => console.log(`http://localhost:5000`));