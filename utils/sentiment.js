const natural = require('natural');
const { SentimentAnalyzer, PorterStemmer } = natural;
const contractions = require('contractions');
const aposToLexForm = require('apos-to-lex-form');
const stopword = require('stopword');

const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');


function sanitizeText(text) {
  // Convert contractions first
  let sanitizedText = contractions.expand(text); 
  // Convert apostrophes and remove non-alphabetical characters
  sanitizedText = aposToLexForm(sanitizedText);
  sanitizedText = sanitizedText.toLowerCase().replace(/[^a-zA-Z\s]+/g, ''); // Removing non-alphabetical chars
  return sanitizedText;
}

function analyseSentiment(text) {
  // Sanitize the text
  let sanitizedText = sanitizeText(text);
  
  // Remove stopwords
  const filteredWords = stopword.removeStopwords(sanitizedText.split(' '));
  
  // Perform sentiment analysis
  const score = analyzer.getSentiment(filteredWords);
  
  // Classify sentiment into more granular categories
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
