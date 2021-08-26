require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Posts = require('./models/posts');

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.get('/posts', async (req, res) => {
  // destructure page and limit and set default values
  const { page = 1, limit = 10 } = req.query;

  try {
    // execute query with page and limit values
    const posts = await Posts.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // get total documents in the Posts collection 
    const count = await Posts.countDocuments();

    // return response with posts, total pages, and current page
    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));