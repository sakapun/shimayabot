const cli = require('cheerio-httpcli');
const _ = require('lodash');

const dabimasjp = 'http://dabimas.jp/kouryaku/';

cli.fetch(`${dabimasjp}stallions`)
	.then((result) => {
		const horseNames = result.$('.stallion_list_panel table span.large')
			.map((i, el) => (
				result.$(el).text().replace(/\d.*/ , '')
			))
			.toArray();
		console.log(_.uniq(horseNames));
		return;
		const newestUrl = result.$('.top_info_message li a').eq(1);
		return newestUrl.click();
	})
    .then((result) => {
        console.log(result.$('div.info').text());
    })
	.catch((err) => {
		// TODO: エラー処理実装
		console.log(2);
	});

