const cli = require('cheerio-httpcli');
const _ = require('lodash');

const dabimasjp = 'http://dabimas.jp/kouryaku/';

let horseSex;
let horsePanelClass;
let insertSQL
if (process.argv[2] === 'shuboba') {
    horseSex = 'stallion';
    horsePanelClass = 'stallion_list_panel';
} else {
    horseSex = 'broodmare';
    horsePanelClass = 'broodmare';
    insertSQL =  "insert into hinba (name, keitou, grade, f, ff, fff, ffff, ffmf, fmf, fmff, fmmf, mf, mff, mfff, mfmf, mmf, mmff, mmmf) values ";
}

const mitouroku = [ 'エンブレイスマイン',
    'シーザリオ',
    'スカーレットブーケ',
    'タニノシスター',
    'ノースリアルト',
    'ハープスター',
    'ヒストリックスター',
    'ブラックエンブレム',
    'マリアライト',
    'ミッキークイーン',
    'メジャーエンブレム' ];


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
                exportHorses.push(150000);
				detailPage.$('.pedigree').eq(0).find('.horse')
					.each((i, el) => {
						exportHorses.push(result.$(el).text());
					});
				console.log(`${insertSQL} \n` + '("' + exportHorses.join("\",\n\"") + '");', "\n");
			})
	})