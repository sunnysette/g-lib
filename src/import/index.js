import React, { useContext, useEffect } from 'react';
import { FirebaseContext } from '../context/Firebase';
//import booksToImport from './data_books';
//import usersToImport from './data_users';

const ImportView = () => {
	const firebase = useContext(FirebaseContext);

	/*useEffect(() => {
		firebase.db.collection('books')
			.orderBy('id', 'asc')
			.get()
			.then(async function(querySnapshot) {
				const arr = [];
				querySnapshot.forEach(async function(doc) {
					const remoteBook = doc.data();
					const importBook = booksToImport[remoteBook.id - 1];

					if (typeof importBook !== 'undefined') {
						remoteBook.rid = doc.id;
						importBook.punjabi_title !== '' && (remoteBook.punjabi_title = importBook.punjabi_title);
						importBook.title !== '' && (remoteBook.title = importBook.title);
						importBook.author !== '' && (remoteBook.author = importBook.author);
						arr.push(remoteBook);
					}
				});
				for (const book in arr) {
					await new Promise(r => setTimeout(r, 1000));
					const id = arr[book].rid;
					delete arr[book].rid;
					firebase.db.collection('books').doc(id).update(arr[book]);
					console.log(book);
				}
			});
	}, []);*/

	/*useEffect(() => {
		async function importUsers() {
			for (let user of usersToImport){
				await new Promise(r => setTimeout(r, 1000));
				await firebase.db.collection("customers").doc().set({
					...user,
					phone: user.phone.toString(),
					email: '',
					registration_date: new Date()
				});
			}
		}
		importUsers();
	}, []);*/

	return null;
};

export default ImportView;