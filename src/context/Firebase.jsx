import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React from 'react';

const FirebaseContext = React.createContext(null);

const config = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
	init;
	auth;
	db;

	constructor() {
		this.init = app.initializeApp(config);
		this.auth = app.auth();
		this.db = app.firestore();
		this.db.enablePersistence({ synchronizeTabs: true })
			.catch((err) => console.log('Error in Enabling Persistence', err));
		// this.db.disableNetwork();
	}
	signIn = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
	signOut = () => this.auth.signOut();
}
export default Firebase;
export { FirebaseContext };