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
with the values from our project on Google cloud, found under APIs & Services > Credentials.
```
REACT_APP_GOOGLE_CLIENT_ID=<Client ID>
GOOGLE_API_KEY=<API Key>
GOOGLE_CLIENT_SECRET=<Secret Key>
GOOGLE_AUTH_REDIRECT=<Redirect URL>
EXPRESS_SESSION_SECRET=<random secret from the internetz>
```

Then, to run the project call the following from the root 'zotdiet' directory :
```
$ npm run dev
```
