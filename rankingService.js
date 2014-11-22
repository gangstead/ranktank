var _ = require('underscore');

var currentRanks = [];
var currentRanksInvalidated = true;

var itemScore = function(item) {
  return (_.size(item.priorities) * _.size(item.priorities)) / _.reduce(item.priorities, function(memo, priority) {
      return memo + priority;
    }, 0);
};

var rankedScores = function(items) {
  var scores = {};

  _.chain(items).filter(function(item) {
    return _.size(item.priorities) > 0;
  }).each(function(item) {
    scores[itemScore(item)] = -1;
  }).value();

  _.chain(_.keys(scores)).sortBy(function(score) {
    return score;
  }).reverse().each(function(score, index) {
    scores[score] = index;
  }).value();

  return scores;
};

exports.getRankedItems = function(items) {
  if (!currentRanksInvalidated) return currentRanks;

  var scores = rankedScores(items);
  var rankedItems = _.chain(items).filter(function(item) {
    return _.size(item.priorities) > 0;
  }).map(function(item) {
    var score = itemScore(item);

    return _.extend({}, item, {
      score: score,
      rank: scores[score]
    });
  }).value();

  return rankedItems;
};

exports.invalidate = function() {
  currentRanksInvalidated = true;
};