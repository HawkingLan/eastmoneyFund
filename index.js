const dataServ = require('./getData');
const fundServ = require('./fundServ');
const fundList = require('./fundList');
const fs = require('fs');
let list = [].concat(fundList);
let limit = 10;

// fetch data
const topTenReq = dataServ.createConcurrency(
    list,
    limit,
    (res, ret, ori) => {
        let { id, name, scale, promise } = res;
        ret.push({
            id,
            name,
            scale
        });
        console.log(`基金规模获取已完成：${Math.round(ret.length / (ori.length + limit) * 10000) / 100}%`);
    },
    item => fundServ.reqScale(item)
);
topTenReq.then(fund => {
    fs.writeFile('./funds_holdings/scales.json', JSON.stringify(fund));
    let count = 0;
    dataServ.createConcurrency(
        fund,
        limit,
        (res, ret, ori) => {
            fs.writeFile(`./funds_holdings/${res.id}-${res.name}.json`, JSON.stringify(res.topten));
            console.log(`基金持仓获取已完成：${Math.round(++count / (fund.length + limit) * 10000) / 100}%`)
        },
        item => fundServ.reqTopTen(item)
    )
});