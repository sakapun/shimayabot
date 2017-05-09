const cli = require('cheerio-httpcli');
const _ = require('lodash');

const dabimasjp = 'http://dabimas.jp/kouryaku/';

let horseSex;
let horsePanelClass;
if (process.argv[2] === 'shuboba') {
    horseSex = 'stallion';
    horsePanelClass = 'stallion_list_panel';
} else {
    horseSex = 'broodmare';
    horsePanelClass = 'broodmare';
}

cli.fetch(`${dabimasjp}${horseSex}s`)
	.then((result) => {
		const horseNames = result.$(`.${horsePanelClass} table span.large`)
			.map((i, el) => (
				result.$(el).text().replace(/\d.*/ , '')
			))
			.toArray();
		console.log(_.uniq(horseNames));
	});
