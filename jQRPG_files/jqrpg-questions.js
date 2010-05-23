/* 
The quiz object clearly holds all of the questions that are asked 
in the game.  This quiz module can be generated any number of ways,
including programatically.  What matters is that the indices of the
question and answer arrays match up properly.
*/

quiz = new Object();

quiz.questions = [
  '<p>Which is longer? (a) 100 centimeters, (b) 1 meter, or (c) They are the same?</p>',
  '<p>Which is shorter? (a) 100 centimeters, (b) 1 meter, or (c) They are the same?</p>',
  '<p>Which is longer? (a) 5000 meters, (b) 2 kilometers, or (c) They are the same?</p>',
  '<p>Which is shorter? (a) 5000 meters, (b) 2 kilometers, or (c) They are the same?</p>',
  '<p>Which is longer? (a) 200 meters, (b) 1 kilometer, or (c) They are the same?</p>',
  '<p>Which is shorter? (a) 200 meters, (b) 1 kilometer, or (c) They are the same?</p>',
  '<p>Which is taller? (a) 2 meters, (b) 400 centimeters, or (c) They are the same?</p>',
  '<p>Which is shorter? (a) 2 meters, (b) 400 centimeters, or (c) They are the same?</p>',
  '<p>Which is bigger? (a) 50 kilograms, (b) 2500 grams, or (c) They are the same?</p>',
  '<p>Which is smaller? (a) 50 kilograms, (b) 2500 grams, or (c) They are the same?</p>'
];

quiz.answers = [
  'c','c','a','b','b','a','b','a','a','b'
];
