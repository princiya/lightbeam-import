const path = require('path');
const fs = require('fs');
const express = require('express');
const http = require('http');

const app = express();
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'data')));

function extractFileName(file) {
  console.log(`📁 ${file}`);
  const index = file.indexOf('.json');
  const name = file.substr(0, index);
  return name.toUpperCase();
}

app.get('/import', (req, res) => {
  console.log('💎💎💎 Importing data...');
  let names = [];
  fs.readdir('./data/', (err, files) => {
    files.forEach(file => names.push(extractFileName(file)));
    res.send(names);
  });
});

const server = http.createServer(app).listen(3000);
console.log('get set go.....!🚀🚀🚀');
