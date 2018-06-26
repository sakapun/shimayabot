const cli = require('cheerio-httpcli');
const crypto = require('crypto');
const fs = require('fs');
const notifier = require('node-notifier');

const fileShimaya = __dirname + '/shimaya_md5.txt';

function notifyShimaya() {
    cli.fetch('http://yawaragitei-shimaya.com/')
        .then((result) => {
            const newestUrl = result.$(".top_info_message li a").eq(0);
            return newestUrl.click();
        })
        .then((result) => {
            fs.readFile(fileShimaya, 'utf-8', (err, preStrHash) => {
                const info = result.$('div.info').text();
                const md5sum = crypto.createHash('md5');
                const hashStr = md5sum.update(info).digest('hex');
                if (err || preStrHash !== hashStr) {
                    console.log(info);
                    if (process.env.DESKTOP_NOTIFY) {
                        notifier.notify({
                            title: "NEW HIGAWARI!!!",
                            message: info.match(/◇◆.*◆◇/)
                        });
                    } else {
                        console.log(info);
                        console.log('NEW HIGAWARI!!!');
                    }
                    fs.writeFile(fileShimaya, hashStr);
                } else {
                    if (!process.env.DESKTOP_NOTIFY) {
                        console.log(info);
                    }
                    console.log('no new higawari....');
                }
            });
        })
        .catch((err) => {
            // TODO: エラー処理実装
            console.log(err)
        });
}
setInterval(notifyShimaya, 60000);
notifyShimaya();
