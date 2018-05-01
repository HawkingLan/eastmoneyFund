const fundServ = require('./fundServ');
const fundList = require('./fundList');
let list = [].concat(fundList);
let limit = 10;

const fs = require('fs');
fundServ.reqTopTen(list[0]).then(res => {
    fs.writeFile(`${list[0].id}-${list[0].name}.json`, JSON.stringify(res));    
});
// fetch data
// let promises = list.splice(0, limit).map(item => {
//     return fundServ.reqScale(item);
// });

// let _cache = [];
// list.reduce((last, item, index) => {
//     return last
//         .then(() => Promise.race(promises))
//         .catch(e => {
//             throw e;
//         })
//         .then(res => {
//             let { id, name, scale, promise } = res;
//             console.log(`第${index + 1}个基金 ${name}的规模为: ${scale}亿元`)
//             _cache.push({
//                 id,
//                 name,
//                 scale
//             });
//             const idx = promises.findIndex(pro => pro === promise);
//             promises.splice(idx, 1);
//             promises.push(fundServ.reqScale(item));
//         })
// }, Promise.resolve()).then(() => {
//     return Promise.all(promises)
//         .then(rets => {
//             rets.forEach(({id, name, scale}) => {
//                 _cache.push({
//                     id,
//                     name,
//                     scale
//                 });
//             });
//         });
// }).then(() => console.log(_cache));