# zotdiet

## Setup
First, install the root project dependencies by calling npm install from the root 'zotdiet' directory :
```
$ npm install
```

Second, install the React dependencies by changing to the 'client' directory and calling npm install again :
 ```
$ cd client
$ npm install
```

## Running in Dev Mode
To run the project in development mode, you need to set the following environment variables. Replace each <value>
with the values from our project on Google cloud, found under APIs & Services > Credentials. The firebase values
can be found in the firebase console project settings under general at the bottom.
```
REACT_APP_GOOGLE_CLIENT_ID=<Client ID>
GOOGLE_API_KEY=<API Key>
GOOGLE_CLIENT_SECRET=<Secret Key>
SPOONACULAR_API_KEY=<Spoon API key>
EXPRESS_SESSION_SECRET=<random secret from the internetz>
FIREBASE_API_KEY=<Firebase/Project-Settings/General>
FIREBASE_AUTH_DOMAIN=<Firebase/Project-Settings/General>
FIREBASE_DATABASE_URL=<Firebase/Project-Settings/General>
FIREBASE_PROJECT_ID=<Firebase/Project-Settings/General>
FIREBASE_STORAGE_BUCKET=<Firebase/Project-Settings/General>
FIREBASE_MESSAGE_SENDER_ID=<Firebase/Project-Settings/General>
FIREBASE_APP_ID=<Firebase/Project-Settings/General>
```

Then, to run the project call the following from the root 'zotdiet' directory :
```
$ npm run dev
```
## Software Used and Citations
- Software Used: Node.js, Bootstrap, React, Google Places API, Google Maps API, Spoonacular API, Firebase
- We used FontAwesome, a fully open-source font and icon toolkit for icons on our web app.
- We used Chart.js, a free open-source Javascript library for our graph data visualization. 
- We used the open-source react pie chart for aesthetic design on our web app. (https://www.npmjs.com/package/react-minimal-pie-chart)
