import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { FirebaseContext } from './context/Firebase';
import BookContextProvider from './context/Book/BookContextProvider';
import CustomerContextProvider from './context/Customer/CustomerContextProvider';

import DashboardView from './views/dashboard';
import BooksView from './views/books';
import BookDetails from './views/books/components/BookDetails';
import CustomersView from './views/customers';
import CustomerDetails from './views/customers/components/CustomerDetails';
import BorrowsView from './views/borrows';
import Login from './views/login/index'
import Navbar from './shared/Navbar'
import './App.css';

function App() {
	const firebase = useContext(FirebaseContext);
	const [ user, setUser ] = useState(undefined);

	useEffect(() => {
		const unlisten = firebase.auth.onAuthStateChanged((authUser) => {
			setUser(authUser);
		});
		return () => unlisten();
	}, []);

	if (typeof user === 'undefined') {
		return null;
	}
	if (!user) {
		return (
			<Login />
		);
	}
	return (
		<BookContextProvider>
			<CustomerContextProvider>
				<BrowserRouter>
					<Navbar />
					<Route exact path="/" component={DashboardView} />
					<Route path="/books/" component={BooksView} />
					<Route exact path="/books/:mode(view|edit)/:id" component={BookDetails} />
					<Route exact path="/books/:mode(new)/" component={BookDetails} />
					<Route path="/customers/" component={CustomersView} />
					<Route exact path="/customers/:mode(view|edit)/:id" component={CustomerDetails} />
					<Route exact path="/customers/:mode(new)/" component={CustomerDetails} />
					<Route path="/borrows/" component={BorrowsView} />
				</BrowserRouter>
			</CustomerContextProvider>
		</BookContextProvider>
	);
}

export default App;
