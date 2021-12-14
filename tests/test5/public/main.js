"use strict";
const canvas = document.querySelector('canvas');
const ctx = canvas?.getContext('2d') || new CanvasRenderingContext2D();
let index = 0;
let items = [
    { name: 'mouth-left-corner-x', value: 0 },
    { name: 'mouth-left-corner-y', value: 0 },
    { name: 'mouth-right-corner-x', value: 0 },
    { name: 'mouth-right-corner-y', value: 0 },
    { name: 'mouth-top-middle-x', value: 0 },
    { name: 'mouth-top-middle-y', value: 0 },
    { name: 'mouth-bottom-middle-x', value: 0 },
    { name: 'mouth-bottom-middle-y', value: 0 },
    { name: 'eye-left-out-corner-x', value: 0 },
    { name: 'eye-left-out-corner-y', value: 0 },
    { name: 'eye-left-in-corner-x', value: 0 },
    { name: 'eye-left-in-corner-y', value: 0 },
    { name: 'eye-left-top-mid-x', value: 0 },
    { name: 'eye-left-top-mid-y', value: 0 },
    { name: 'eye-left-bottom-mid-x', value: 0 },
    { name: 'eye-left-bottom-mid-y', value: 0 },
    { name: 'eye-right-out-corner-x', value: 0 },
    { name: 'eye-right-out-corner-y', value: 0 },
    { name: 'eye-right-in-corner-x', value: 0 },
    { name: 'eye-right-in-corner-y', value: 0 },
    { name: 'eye-right-top-mid-x', value: 0 },
    { name: 'eye-right-top-mid-y', value: 0 },
    { name: 'eye-right-bottom-mid-x', value: 0 },
    { name: 'eye-right-bottom-mid-y', value: 0 },
    { name: 'eyebrow-left-out-x', value: 0 },
    { name: 'eyebrow-left-out-y', value: 0 },
    { name: 'eyebrow-left-in-x', value: 0 },
    { name: 'eyebrow-left-in-y', value: 0 },
    { name: 'eyebrow-left-mid-x', value: 0 },
    { name: 'eyebrow-left-mid-y', value: 0 },
    { name: 'eyebrow-right-out-x', value: 0 },
    { name: 'eyebrow-right-out-y', value: 0 },
    { name: 'eyebrow-right-in-x', value: 0 },
    { name: 'eyebrow-right-in-y', value: 0 },
    { name: 'eyebrow-right-mid-x', value: 0 },
    { name: 'eyebrow-right-mid-y', value: 0 },
];
switchText();
document.querySelector('#image-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.querySelector('form #url') || new HTMLInputElement();
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0, img.width, img.height, // source rectangle
        0, 0, canvas?.width || 0, canvas?.height || 0); // destination rectangle
    };
    img.src = url.value;
});
canvas?.addEventListener('click', (ev) => {
    const pos = {
        x: ev.pageX - 10,
        y: ev.pageY - 10
    };
    ctx.fillStyle = 'red';
    ctx.fillRect(pos.x, pos.y, 3, 3);
    items[index].value = pos.x;
    index++;
    items[index].value = pos.y;
    index++;
    switchText();
});
document.querySelector('#save-test')?.addEventListener('click', async () => {
    let data = GenDataFromItems();
    let label = prompt('Label: ');
    const res = await fetch('/addtest', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({ data, label }) // body data type must match "Content-Type" header
    });
    console.log(await res.json());
});
document.querySelector('#test')?.addEventListener('click', async () => {
    const res = await fetch('/predict', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({ features: GenDataFromItems() }) // body data type must match "Content-Type" header
    });
    const data = await res.json();
    let list = document.createElement('ol');
    for (let p in data.probability[0]) {
        let li = document.createElement('li');
        li.textContent = `${p}: ${data.probability[0][p]}%`;
        list.appendChild(li);
    }
    document.querySelector('#pred').innerHTML = `Prediction: ${(data.prediction[0])}`;
    document.querySelector('#prob').innerHTML = '';
    document.querySelector('#prob')?.appendChild(list);
});
function switchText() {
    if (index < items.length) {
        document.querySelector('#next-item').innerHTML = items[index].name.substring(0, items[index].name.length - 2);
    }
    else {
        document.querySelector('#next-item').innerHTML = 'Done';
    }
}
function GenDataFromItems() {
    let arr = [];
    items.forEach(item => {
        arr.push(item.value);
    });
    return arr;
}
