'use strict';

var _fs = require('fs');

var _path = require('path');

var _expose = require('./expose');

var { __dirname } = _expose; // eslint-disable-line no-shadow

var wordlist = {};

['english', 'american', 'australian', 'british', 'canadian'].forEach(function (dialect) {
  var dialectKey = dialect === 'english' ? dialect : 'english/' + dialect;
  var dialectWords = [];
  [10, 20, 35, 40, 50, 55, 60, 70].forEach(function (frequency) {
    var frequencyKey = dialectKey + '/' + frequency;
    var filePath = _path.join(__dirname, dialect + '-words-' + frequency + '.json');
    var frequencyWords = JSON.parse(_fs.readFileSync(filePath, 'utf8'));
    wordlist[frequencyKey] = frequencyWords;
    dialectWords.push(...frequencyWords);
  });
  wordlist[dialectKey] = dialectWords.sort();
});

exports.default = wordlist;
module.exports = exports['default'];