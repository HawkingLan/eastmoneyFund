// decoder
const StringDecoder = require('string_decoder').StringDecoder;
const decodeData = (data, charset = 'utf8') => {
    const decoder = new StringDecoder(charset);
    return decoder.write(Buffer.from(data));
};

// html parser
const cheerio = require('cheerio');
const loadHtml = data => {
    let html = decodeData(data);
    return cheerio.load(html); 
};


// json parser
const loadJson = data => {
    let jsonStr = decodeData(data);
    return JSON.parse(jsonStr);
};

module.exports = {
    loadHtml,
    loadJson
};
