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
GOOGLE_AUTH_REDIRECT=<Redirect URL>
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
