import { ExportsCollection } from '../db/ExportsCollection';

const URLS = [
	'https://www.lempire.com/',
	'https://www.lemlist.com/',
	'https://www.lemverse.com/',
	'https://www.lemstash.com/'
];

/**
 * Return a random URL from the above declared URLS array.
 * @return {string}
 */
function pickRandomUrl(){
	return URLS[Math.floor(Math.random() * URLS.length)];
}

Meteor.methods({
	async 'exports.start'() {
		let progress = 0;

		const exportId = await ExportsCollection.insert({
			name: `Export N°${ExportsCollection.find().count() + 1}`,
			createdAt: new Date,
			progress,
		});

		// Each second, the export progress by 5%
		// Note: this implementation will NOT be able to resume an export if the server have
		// been closed before the export is completed.
		// A way to handle it would be to create a permanent interval that would check every second
		// if an export must progress.
		const intervalHandle = Meteor.setInterval(() => {
			progress += 5;

			ExportsCollection.update(exportId, {
				$set: {
					progress,
					// The URL is only picked once the export is completed.
					url: progress >= 100 ? pickRandomUrl() : undefined
				}
			});

			if(progress >= 100){
				clearInterval(intervalHandle);
			}
		}, 1000);

		return exportId;
	}
});