function getFormattedDate(unixTimestamp) {
	const dateObj = new Date(unixTimestamp * 1000);
	return dateObj.getDate() + "/" + (dateObj.getMonth() + 1) + "/" + dateObj.getUTCFullYear();
}

export { getFormattedDate };
