import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import { FirebaseContext } from './context/Firebase';
import DashboardView from './views/dashboard';
import BooksView from './views/books';
import CustomersView from './views/customers';
import BorrowsView from './views/borrows';
import Login from './views/login/index'
import Navbar from './shared/Navbar'
import './App.css';

function App() {
	const firebase = useContext(FirebaseContext);
	const [ user, setUser ] = useState(null);

	useEffect(() => {
		const unlisten = firebase.auth.onAuthStateChanged((authUser) => {
			setUser(authUser);
		});
		return () => unlisten();
	});

	if (!user) {
		return (
			<Login />
		);
	}
	return (
		<BrowserRouter>
			<Navbar />
			<ul>
				<li><Link to="/">Dashboard</Link></li>
				<li><Link to="/books/">Books</Link></li>
				<li><Link to="/customers/">Customers</Link></li>
				<li><Link to="/borrows/">Borrows</Link></li>
			</ul>
			<Route exact path="/" component={DashboardView} />
			<Route path="/books/" component={BooksView} />
			<Route path="/customers/" component={CustomersView} />
			<Route path="/borrows/" component={BorrowsView} />
		</BrowserRouter>
	);
}

export default App;
