export const dateTimeFormatter = new Intl.DateTimeFormat('en', {
	dateStyle: 'short',
	timeStyle: 'short'
});

export const dateFormatter = new Intl.DateTimeFormat('en', {
	dateStyle: 'short'
});

export function getTimeDifferenceInDays(time1: Date, time2: Date) {
	const timeDiff = time1.getTime() - time2.getTime();
	const dayDiff = timeDiff / (1000 * 3600 * 24);
	return dayDiff;
}

export function getAge(time1: Date, time2: Date) {
	console.log('time1', time1);
	console.log('time2', time2);

	const timeDiff = time1.getTime() - time2.getTime();
	const dayDiff = timeDiff / (1000 * 3600 * 24);
	return Math.floor(dayDiff / 365);
}
