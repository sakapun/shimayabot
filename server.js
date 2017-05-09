const cli = require('cheerio-httpcli');


cli.fetch('http://yawaragitei-shimaya.com/')
	.then((result) => {
		const newestUrl = result.$(".top_info_message li a").eq(1);
		return newestUrl.click();
	})
    .then((result) => {
		const info = result.$('div.info').text();
        if (!/2017-05-05/.test(info)) {
        	console.log(info);
			console.log('new higawari!');
		} else {
        	console.log('not new higawari.....')
		}
    })
	.catch((err) => {
		// TODO: エラー処理実装
		console.log(err)
	});

