const express = require('express');
const bodyParser = require('body-parser');
const spoonRouter = require('./server/routes/SpoonRoutes');
const userRouter = require("./server/routes/UserRoutes");
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

const prodMode = process.env.NODE_ENV === 'production';
const app = express();
app.use(bodyParser.json());

// Initialize server side user session parameters
app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: prodMode,
  }
}));

// Initialize routes
app.use('/api/user', userRouter);
app.use('/spoon', spoonRouter);

// Set application port
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
  console.log(`app running on port ${app.get('port')}`)
});



// Configure client to use correct build directory
// if app is running in production mode
if (prodMode) {
  const path = require('path');
  app.use(express.static('client/build'));
  app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}
