const express = require('express');
const fs = require('fs');
const path = require('path')
const app = express();
const port = 3000;


app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

// app.get('/', (req, res) => {
//     res.json({ message: 'HoneyBee!' });
// });

app.get('/', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read data' });
            return;
        }
        const jsonData = JSON.parse(data);
        res.render('index', { items: jsonData });
    });
});

// New route to render Pug template for viewing data by ID
app.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read data' });
            return;
        }
        const jsonData = JSON.parse(data);
        const item = jsonData.find(obj => obj.id === id);
        if (!item) {
            res.status(404).json({ error: 'Data not found' });
            return;
        }

        // Get all ids in an array
        const ids = jsonData.map(obj => obj.id);
        const currentIndex = ids.indexOf(id);

        // Calculate previous and next ids
        const prevIndex = (currentIndex - 1 + ids.length) % ids.length;
        const nextIndex = (currentIndex + 1) % ids.length;

        const prevId = ids[prevIndex];
        const nextId = ids[nextIndex];

        res.render('code', { item, prevId, nextId });
    });
});

app.get('/api/data', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read data' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.get('/api/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read data' });
            return;
        }
        const jsonData = JSON.parse(data);
        const item = jsonData.find(obj => obj.id === id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    });
});

app.get('/api/codes', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read data' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.get('/api/codes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read data' });
            return;
        }
        const jsonData = JSON.parse(data);
        const item = jsonData.find(obj => obj.id === id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});