const http = require('http');
const load = require('./getData');

// fund scale
const getScale = $ => {
    let text = $('.infoOfFund tr td').eq(1).text();
    let scale = text.substring(text.indexOf('：') + 1, text.indexOf('亿元'));
    return scale;
};

const reqScale = fund => {
    const promise = new Promise((resolve, reject) => {
        let url = `http://fund.eastmoney.com/${fund.id}.html`;
        http.get(url, res => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                let $ = load.loadHtml(data);
                resolve({
                    id: fund.id,
                    name: fund.name,
                    scale: getScale($),
                    promise
                });
            });
        });
    });

    return promise;
};

// top10 fund
const getTopTen = $ => {
    let arr = [];
    let eles = $('tbody tr')
    for (let i = 0; i < 10; i++) {
        let ele = eles.eq(i).children('td');
        arr.push({
            id: ele.eq(1).text(),
            name: ele.eq(2).text(),
            ratio: ele.eq(6).text(),
            stocks: ele.eq(7).text(),
            marketVal: ele.eq(8).text()
        });
    }

    return arr;
};

const reqTopTen = fund => {
    const promise = new Promise((resolve, reject) => {
        let url = `http://fund.eastmoney.com/f10/FundArchivesDatas.aspx?type=jjcc&topline=10&code=${fund.id}`;
        http.get(url, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                eval(data);
                let $ = load.loadHtml(apidata.content);
                let topten = getTopTen($);
                console.log(topten);
                resolve(topten);
                // let json = load.loadJson(data);
                // resolve(json);
            });
        })
    });

    return promise;
}

module.exports = {
    reqScale,
    reqTopTen,
    getTopTen
};
