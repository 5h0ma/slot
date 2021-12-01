const requestPromise = require('request-promise');
const cheerio = require('cheerio');

const url = 'https://daidata.goraggio.com/100928/unit_list?model=%EF%BE%8F%EF%BD%B2%EF%BD%BC%EF%BE%9E%EF%BD%AC%EF%BD%B8%EF%BE%9E%EF%BE%97%EF%BD%B0III&ballPrice=21.70&f=1';

(async () => {
    // httpリクエストを投げる
    const response = await requestPromise({
      uri: url,
      gzip: true
    });
    // console.log(response)
    let $ = cheerio.load(response);
    // console.log($)
    // 取得したいデータのタグを指定する
    let title = $('#Main-Contents').html();
    console.log(title);

    return title;
  ;
})();