const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/records', { useNewUrlParser: true, useUnifiedTopology: true });

const recordSchema = new mongoose.Schema({
  regNumber: String,
  collectionName: String,
  fields: String
});

const Record = mongoose.model('Record', recordSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  const records = await Record.find();
  res.render('index', { records });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', async (req, res) => {
  const { regNumber, collectionName, fields } = req.body;
  await new Record({ regNumber, collectionName, fields }).save();
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const record = await Record.findById(req.params.id);
  res.render('edit', { record });
});

app.post('/edit/:id', async (req, res) => {
  const { regNumber, collectionName, fields } = req.body;
  await Record.findByIdAndUpdate(req.params.id, { regNumber, collectionName, fields });
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  await Record.findByIdAndRemove(req.params.id);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});