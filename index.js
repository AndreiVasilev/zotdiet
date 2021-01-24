const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// IMPORT MODELS
// require('./models/User');

//IMPORT ROUTES
// require('./routes/userRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static('client/build'));
  app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});
