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

// concurrency
const createConcurrency = (list, limit, handler, addPromise) => {
    if (!Array.isArray(list)) {
        throw new Error('first param must be an array');
    }

    limit = isNaN(limit) ? 5 : Math.round(Math.abs(limit));
    handler = typeof handler === 'function' ? handler : () => {};
    addPromise = typeof addPromise === 'function' ? addPromise : () => {};

    let promises = [];
    const add = (res, item) => {
        const idx = promises.findIndex(pro => res && pro === res.promise);
        idx > -1 && promises.splice(idx, 1);
        promises.push(addPromise(item) || Promise.resolve());
    };
    list.splice(0, limit).forEach(item => add(null, item));

    let cache = [];
    return list.reduce((last, item, index) => {
        return last
            .then(() => Promise.race(promises))
            .catch(e => {
                throw e;
            })
            .then(res => {
                handler(res, cache, list);
                add(res, item);
            })
    }, Promise.resolve()).then(() => {
        return Promise.all(promises).then(rets => {
            rets.forEach(item => {
                handler(item, cache, list);
            });
            return cache;
        });
    });
};

module.exports = {
    loadHtml,
    loadJson,
    createConcurrency
};
