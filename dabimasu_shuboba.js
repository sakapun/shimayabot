const cli = require('cheerio-httpcli');
const _ = require('lodash');

const dabimasjp = 'http://dabimas.jp/kouryaku/';

let horseSex;
let horsePanelClass;
let insertSQL
if (process.argv[2] === 'shuboba') {
    horseSex = 'stallion';
    horsePanelClass = 'stallion_list_panel';
    insertSQL =  "insert into shuboba (name, keitou, f, ff, fff, ffff, ffmf, fmf, fmff, fmmf, mf, mff, mfff, mfmf, mmf, mmff, mmmf) values ";
} else {
    horseSex = 'broodmare';
    horsePanelClass = 'broodmare';
    insertSQL =  "insert into hinba (name, keitou, grade, f, ff, fff, ffff, ffmf, fmf, fmff, fmmf, mf, mff, mfff, mfmf, mmf, mmff, mmmf) values ";
}

const mitouroku = [
    'アグネスフライト',
    'エイシンワシントン',
    'オマワリサン',
    'コイノボリ',
    'コパノリッキー',
    'サクラセンチュリー',
    'サクラメガワンダー',
    'サトノアレス',
    'サトノクラウン',
    'シャドウゲイト',
    'ショワジール',
    'シルポート',
    'シンボリルドルフ',
    'ジーカップダイスキ',
    'ストリートクライ',
    'スプリットフィンガー',
    'スマートロビン',
    'セイウンスカイ',
    'タッチミーノット',
    'タマモサポート',
    'ダノンシャンティ',
    'ダノンバラード',
    'ダメダメダメダメダ',
    'デスペラード',
    'トウカイパルサー',
    'トシグリーン',
    'トーセンブライト',
    'トーワウィナー',
    'ナイスミーチュー',
    'ネコパンチ',
    'ネルトスグアサ',
    'ノットアシングルダウト',
    'ノラネコ',
    'ハイアーゲーム',
    'ハードスパン',
    'フジサイレンス',
    'ボクニモユメハアル',
    'マイネルスターリー',
    'マイネルレーニア',
    'マズイマズイウマイ',
    'マチカネイワシミズ',
    'メイショウクオリア',
    'メジロデュレン',
    'モグモグパクパク',
    'モチ',
    'モーニン',
    'ユウキュウ',
    'リツンタイクーン',
    'リーチザクラウン',
    'ロゴタイプ',
    'ロジユニヴァース',
    'ワイルドワンダー'
];


cli.fetch(`${dabimasjp}${horseSex}s`)
	.then((result) => {
		const horseNames = result.$(`.${horsePanelClass} table span.large`)
			.filter((i, el) => (
				_.includes(mitouroku, result.$(el).text())
			)).each((i, el) => {
				// 出力するウマ配列
				const exportHorses = [];
				exportHorses.push(result.$(el).text());

				// そのページの中には入り、detailPageにレスポンスを保存
				const detailPage = result.$(el).parents(`.${horsePanelClass} a`).clickSync();
				exportHorses.push(detailPage.$('.category').text().replace(/系/, ''));
                // exportHorses.push(150000);

                // rarity レア度
                exportHorses.push(detailPage.$('.paper td').eq(1).find('img').length);

                // sodati 成長速度
                exportHorses.push(detailPage.$('.horse_spec p.align_center').eq(0).text());

                // min max 適正距離
                detailPage.$('.horse_spec p.align_center').eq(1).text().replace(/m/g, '').split('〜')
                    .forEach(kyori => {
                        exportHorses.push(kyori)
                    });

                // 画像からパラメータの数値だけ抜き出す
                const imgArray = [2,4,6,9,11,13].map(i => (
                    detailPage.$('.horse_spec img').eq(i).attr('src').match(/\d/g)[1]
                ));
                // dart ダート
                const dartParam = {
                    "1": "△",
                    "2": "○",
                    "3": "◎"
                };
                exportHorses.push(dartParam[imgArray.shift()]);

                const otherParam = {
                    "1": "A",
                    "2": "B",
                    "3": "C"
                };
                // weekness, kisho, honor, power, base
                imgArray.forEach(paramNum => {
                    exportHorses.push(otherParam[paramNum]);
                });

				detailPage.$('.pedigree').eq(0).find('.horse')
					.each((i, el) => {
						exportHorses.push(result.$(el).text());
					});
				console.log(`${insertSQL} \n` + '("' + exportHorses.join("\",\n\"") + '");', "\n");
			})
	})