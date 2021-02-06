const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
dotenv.config()
const spoonRouter = require('./server/routes/SpoonRoutes');

const session = require('express-session')

dotenv.config();

const prodMode = process.env.NODE_ENV === 'production';
const app = express();

app.use(bodyParser.json());


app.use('/spoon', spoonRouter)

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

// Set application port
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
  console.log(`app running on port ${app.get('port')}`)
});

// Import API routes
require('./server/routes/UserRoutes')(app);


// Configure client to use correct build directory
// if app is running in production mode
if (prodMode) {
  const path = require('path');
  app.use(express.static('client/build'));
  app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}
