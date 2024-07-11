const express = require('express');
const fs = require('fs');
const path = require('path')
const app = express();
const port = 3000;


app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

// Load index.pug for the root URL
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

// Load the entire JSON response
app.get('/json.json', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read data' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Load view.pug for a specific ID
app.get('/:id(\\d+)', (req, res) => {
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

        const ids = jsonData.map(obj => obj.id);
        const currentIndex = ids.indexOf(id);

        const prevIndex = (currentIndex - 1 + ids.length) % ids.length;
        const nextIndex = (currentIndex + 1) % ids.length;

        const prevId = ids[prevIndex];
        const nextId = ids[nextIndex];

        res.render('code', { item, prevId, nextId });
    });
});

// Load the image for a specific ID
app.get('/:id(\\d+).png', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read data' });
            return;
        }
        const jsonData = JSON.parse(data);
        const item = jsonData.find(obj => obj.id === id);
        if (item) {
            res.redirect(item.img);
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    });
});

// Load the framed image for a specific ID
app.get('/framed/:id(\\d+).png', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read data' });
            return;
        }
        const jsonData = JSON.parse(data);
        const item = jsonData.find(obj => obj.id === id);
        if (item) {
            res.redirect(item.display_img);
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    });
});

// Load the JSON entry for a specific ID
app.get('/:id(\\d+).json', (req, res) => {
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