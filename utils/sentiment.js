const natural = require('natural');
const { SentimentAnalyzer, PorterStemmer } = natural;
const contractions = require('contractions');
const aposToLexForm = require('apos-to-lex-form');
const stopword = require('stopword');

const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

function sanitizeText(text) {

  let sanitizedText = contractions.expand(text); 

  sanitizedText = aposToLexForm(sanitizedText);
  sanitizedText = sanitizedText.toLowerCase().replace(/[^a-zA-Z\s]+/g, ''); 
  return sanitizedText;
}

function analyseSentiment(text) {

  let sanitizedText = sanitizeText(text);

  const filteredWords = stopword.removeStopwords(sanitizedText.split(' '));

  const score = analyzer.getSentiment(filteredWords);

  let sentiment;
  if (score > 0.5) {
    sentiment = 'very positive';
  } else if (score > 0) {
    sentiment = 'positive';
  } else if (score < -0.5) {
    sentiment = 'very negative';
  } else if (score < 0) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }

  return { score, sentiment };
}

module.exports = analyseSentiment;