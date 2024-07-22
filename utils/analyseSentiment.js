const natural = require('natural');
const { SentimentAnalyzer, PorterStemmer } = natural;
const aposToLexForm = require('apos-to-lex-form');
const stopword = require('stopword');

const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

function analyseSentiment(text) {
  // Sanitize the text
  let sanitizedText = aposToLexForm(text);
  sanitizedText = sanitizedText.toLowerCase().replace(/[^a-zA-Z\s]+/g, '');
  
  // Remove stopwords
  const filteredWords = stopword.removeStopwords(sanitizedText.split(' '));
  
  // Perform sentiment analysis
  const score = analyzer.getSentiment(filteredWords);
  
  // Classify sentiment
  let sentiment;
  if (score > 0) {
    sentiment = 'positive';
  } else if (score < 0) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }

  return { score, sentiment };
}

module.exports = analyseSentiment;
