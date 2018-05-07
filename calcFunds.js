const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

let files = fs.readdirSync('./funds_holdings').map(name => `./funds_holdings/${name}`);
let cache = {};
files.forEach(fileName => {
    let data = fs.readFileSync(fileName);
    data = decoder.write(Buffer.from(data));
    data = JSON.parse(data);
    data.forEach(item => {
        if (cache[item.id] === undefined) {
            cache[item.id] = {
                name: item.name,
                value: 0
            };
        }

        let val = parseFloat(item.marketVal);
        cache[item.id].value += isNaN(val) ? 0 : val;
    });
});

fs.writeFile('./calcFundsData.js', `var fundData = ${JSON.stringify(cache)}`);