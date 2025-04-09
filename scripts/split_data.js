const fs = require('fs');
const path = require('path');

// Read the original data file
const data = JSON.parse(fs.readFileSync('data/data.json', 'utf8'));

// Create index file for food tests
const foodTestsIndex = {
  tests: data.tests.map(test => ({
    name: test.name,
    date: test.date,
    fileName: `${test.name.toLowerCase().replace(/\s+/g, '-')}.json`
  }))
};

// Ensure directories exist
fs.mkdirSync('public/data/food-tests', { recursive: true });
fs.mkdirSync('public/data/battle-stats', { recursive: true });

// Write index file
fs.writeFileSync(
  'public/data/food-tests/index.json',
  JSON.stringify(foodTestsIndex, null, 2)
);

// Write individual test files
data.tests.forEach(test => {
  const fileName = test.name.toLowerCase().replace(/\s+/g, '-') + '.json';
  fs.writeFileSync(
    path.join('public/data/food-tests', fileName),
    JSON.stringify(test, null, 2)
  );
});

console.log('Data files have been split successfully!'); 