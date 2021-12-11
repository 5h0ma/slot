const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const { filter } = require('domutils');

const url = 'https://min-repo.com/572771/?kishu=%E3%83%9E%E3%82%A4%E3%82%B8%E3%83%A3%E3%82%B0%E3%83%A9%E3%83%BC%EF%BC%A9%EF%BC%B6';

(async () => {
  const response = await requestPromise({
    uri: url,
    gzip: true
  });
  let $ = cheerio.load(response);
  let list = $("tbody", 'article').html();
  list = list.match(/>.*?</g)

  list = list.filter(item => {
    console.log(String(item).length)
    return String(item).length !== 2
  })
  list = list.map(item => {
    item = String(item).replace(/>/, "")
    item = String(item).replace(/</, "")
    return item
  })
  console.log(list)
  let machineNumber = 0
  let difference = 1
  let gameNumber = 2
  let out = 3
  const listObject = []
  for (let i = 0; i < list.length / 4; i++) {
    listObject.push({
      machineNumber: list[machineNumber],
      difference: list[difference],
      gameNumber: list[gameNumber],
      out: list[out]
    })
    machineNumber += 4
    difference += 4
    gameNumber += 4
    out += 4
  }
  console.log(listObject)
})();