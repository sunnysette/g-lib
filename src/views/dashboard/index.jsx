import React, { useEffect, useContext } from 'react';
import { FirebaseContext } from '../../context/Firebase';

const DashboardView = () => {
	const firebase = useContext(FirebaseContext);

	useEffect(() => {
		console.log("DashboardMount");
		firebase.db.collection('books').get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					console.log("dashboard", doc.id, " => ", doc.data());
				});
			});
		return () => console.log("DasboardUnmount");
	});

	return (
		<p>This is the Dashboard</p>
	);
};

export default DashboardView;