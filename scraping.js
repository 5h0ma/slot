const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const { filter } = require('domutils');

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

function delay(n){
  return new Promise(function(resolve){
      setTimeout(resolve,n*1000);
  });
}

async function readMachineData(url){
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
  list = list.filter(item => {
    if(item === "台番" || item === "差枚" || item === "G数" || item === "出率"){
      return false
    }else{
      return true
    }
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
  return listObject
}

async function readMachineTypeData(url){
  const response = await requestPromise({
    uri: url,
    gzip: true
  });
  let $ = cheerio.load(response);
  let hallName = $("span[class=hall_name]","article").text();
  let date = $("time[class=date]").html();
  let list = ""
  $("table.kishu","article").each((i, elem) => {  
    list += $(elem).html()       
});
  let mathineTypelist = list.match(/>.*?</g)
  mathineTypelist = mathineTypelist.filter(item => {
    return String(item).length !== 2
  })
  mathineTypelist = mathineTypelist.map(item => {
    item = String(item).replace(/>/, "")
    item = String(item).replace(/</, "")
    return item
  })
  mathineTypelist = mathineTypelist.filter(item => {
    if(item === "機種" || item === "平均差枚" || item === "平均G数" || item === "勝率" || item === "出率"){
      return false
    }else{
      return true
    }
  })
  let queryList = list.match(/<a href=".*?">/g)
  queryList = queryList.map(item => {
    item = String(item).replace(/<a href="/, "")
    item = String(item).replace(/">/, "")
    return item
  })
  let machineName = 0
  let avarageDifference = 1
  let avarageGameNumber = 2
  let winRate = 3
  let machineRate = 4
  let query = 0
  const hallInfo = {
    hallName:hallName,
    date:date,
    mathineTypelist:[]}
  for (let i = 0; i < mathineTypelist.length / 5; i++) {
    hallInfo.mathineTypelist.push({
      machineName: mathineTypelist[machineName],
      avarageDifference: mathineTypelist[avarageDifference],
      avarageGameNumber: mathineTypelist[avarageGameNumber],
      winRate: mathineTypelist[winRate],
      machineRate: mathineTypelist[machineRate],
      query: queryList[query]
    })
    machineName += 5
    avarageDifference += 5
    avarageGameNumber += 5
    winRate += 5
    machineRate += 5
    query ++
  }
  console.log(hallInfo)
  return hallInfo
}

const insertDocuments = (db, callback) => {
  const documents = [
   { name:'akiko', age:19 }
   ]
 db.collection('user').insertMany(documents, (err, result) => {
  callback(result)
  })
 }

(async () => {
  const url = "https://min-repo.com/576463/"
  const hallInfo = await readMachineTypeData(url)
  // const dailyData = []
  // for(const machineType of hallInfo.mathineTypelist){
  //   const machineList = await readMachineData(`${url}${machineType.query}`)
  //   dailyData.push({
  //     machineType:machineType,
  //     machineList:machineList
  //   })
  //   await delay(10);
  // }
  // const mongoClient = await MongoClient.connect('mongodb://root:root@127.0.0.1:27017')
  // const db = mongoClient.db("slot");
  // await db.createCollection('dailyData');
  // await db.collection("test").insertOne({hallName:hallInfo.hallName,date:hallInfo.date,dailyData:dailyData});
  // mongoClient.close()
})();