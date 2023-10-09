const fs = require('fs');

const http = require('http');

const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

/// Syncronus file reading from json format and parse into a javascript

const tempOverview = fs.readFileSync(`${__dirname}/overview.html`, 'utf-8');

const tempcards = fs.readFileSync(`${__dirname}/templet-card.html`, 'utf-8');

const tempProduct = fs.readFileSync(`${__dirname}/product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');

const dataObj = JSON.parse(data);
const slug = dataObj.map((el) => slugify(el.productName, { lower: true }));

//console.log(slug);

////// url
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  ///Overview logic

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempcards, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    ////  Product templete
  } else if (pathname === '/product') {
    res.writeHead(404, { 'content-type': 'text/html' });

    const product = dataObj[query.id];

    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    //// APi
  } else if (pathname === '/api') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data);
  }

  //////// ERROR code
  else {
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end('<h1>Page not found</h1>');
  }
});
server.listen(2000, '127.0.0.1', () => {
  console.log('listeining');
});
