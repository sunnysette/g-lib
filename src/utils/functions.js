function getFormattedDate(unixTimestamp) {
	const dateObj = new Date(unixTimestamp * 1000);
	return dateObj.getDate() + "/" + (dateObj.getMonth() + 1) + "/" + dateObj.getUTCFullYear();
}
function dbWritePromise(functionPromise) {
	if(window.navigator.onLine) {
		return functionPromise
	}
	else {
		return Promise.resolve()
	}
}
export { getFormattedDate, dbWritePromise };
