const nlp = require("natural");
const sw = require("stopword");

const LANGUAGE = "EN";
const DEFAULT_CATEGORY = 'N';
const DEFAULT_CATEGORY_CAPITALIZED = 'NNP';

class NLPService {
  constructor() {
    this.tokenizer = new nlp.WordTokenizer();  // splits on anything except alphabetic characters, digits, and underscore

    // POS Tagging
    this.lexicon = new nlp.Lexicon(LANGUAGE, DEFAULT_CATEGORY, DEFAULT_CATEGORY_CAPITALIZED);
    this.ruleSet = new nlp.RuleSet(LANGUAGE);
    this.tagger = new nlp.BrillPOSTagger(this.lexicon, this.ruleSet);
  }

  /**
   * Tokenize given text
   *
   * @param text : string of text to tokenize
   * @returns list of tokens
   */
  tokenize(text) {
    return this.tokenizer.tokenize(text);  // returns list of tokens
  }

  /**
   * Remove stopwords from given wordlist
   *
   * @param wordList : list of words to remove stopwords from
   * @returns list of non-stopwords
   */
  removeStopwords(wordList) {
    return sw.removeStopwords(wordList);
  }

  /**
   * Use POS tagger to remove adjectives
   *
   * @param wordList : list of words to remove adjectives from
   * @returns list of non-adjectives
   */
  posTagger(wordList) {
    const posTags = this.tagger.tag(wordList).taggedWords;                    // list of { token: XX, tag: XX }
    const nonAdjTags = posTags.filter((posTag) => posTag.tag !== "ADJ");   // remove adjectives
    const resWords = nonAdjTags.map((nonAdjTag) => nonAdjTag.token);      // return list of resulting tokens (non-adjective)
    return resWords;
  }

  // Text Standardization NLP Pipeline
  // 1. tokenize text
  // 2. remove stopwords
  // 3. use POS tagging to remove adjectives
  // 4. stemming? // TODO?
  standardize(text) {
    return this.posTagger(this.removeStopwords(this.tokenize(text)));
  }
}

// Export singleton instance of NLPService
module.exports = new NLPService();