const cli = require('cheerio-httpcli');


cli.fetch('http://yawaragitei-shimaya.com/')
	.then((result) => {
		const newestUrl = result.$(".top_info_message li a").eq(1);
		return newestUrl.click();
	})
    .then((result) => {
        console.log(result.$('div.info').text());
    })
	.catch((err) => {
		// TODO: エラー処理実装
		console.log(2);
	});

