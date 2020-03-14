import React, { useEffect, useContext } from 'react';
import { FirebaseContext } from '../../context/Firebase';

const CustomersView = () => {
	const firebase = useContext(FirebaseContext);

	useEffect(() => {
		let mounted = true;
		firebase.db.collection('books').get()
			.then(function(querySnapshot) {
				if (mounted) {
					querySnapshot.forEach(function(doc) {
						console.log("dashboard", doc.id, " => ", doc.data());
					});
				}
			});
		return () => { mounted = false; };
	});

	return (
		<p>This is the Customers</p>
	);
};

export default CustomersView;