const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Load ratings from file
const getRatings = () => {
  const data = fs.readFileSync('ratings.json');
  return JSON.parse(data);
};

// Save rating to file
const saveRating = (newRating) => {
  const ratings = getRatings();
  ratings.unshift(newRating);
  fs.writeFileSync('ratings.json', JSON.stringify(ratings, null, 2));
};

app.get('/api/ratings', (req, res) => {
  res.json(getRatings());
});

app.post('/api/ratings', (req, res) => {
  const { name, rating, comment } = req.body;
  if (!name || !rating) {
    return res.status(400).json({ message: 'Name and rating are required.' });
  }

  const newRating = {
    name,
    rating,
    comment,
    timestamp: new Date().toISOString()
  };

  saveRating(newRating);
  res.status(201).json({ message: 'Thank you for your rating!' });
});

app.listen(PORT, () => {
  console.log(`SysNexa backend running at http://localhost:${PORT}`);
});
