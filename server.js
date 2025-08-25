// C:\ziioz-api\server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.disable('etag');                 // avoid 304s
app.use(cors());
app.use(express.json());

// force simple HTTP/1.1 behavior per response
app.use((req, res, next) => {
  res.setHeader('Connection', 'close');               // no keep-alive
  res.setHeader('Content-Type', 'application/json');  // explicit
  next();
});

app.get('/health', (req, res) => {
  res.status(200).send(JSON.stringify({ status: 'ok' }));
});

app.get('/feed', (req, res) => {
  const payload = {
    posts: [
      { id: 1, author: 'ZiiOZ', content: 'Hello from local API 👋' },
      { id: 2, author: 'Dev',   content: 'Compose + Retrofit demo' },
    ],
  };
  // send with a fixed Content-Length to keep OkHttp happy
  const body = Buffer.from(JSON.stringify(payload), 'utf8');
  res.setHeader('Content-Length', String(body.length));
  res.status(200).end(body);
});

// crash safety
process.on('unhandledRejection', e => console.error('UNHANDLED REJECTION', e));
process.on('uncaughtException',  e => console.error('UNCAUGHT EXCEPTION', e));

const PORT = 3000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`ZiiOZ API listening on http://${HOST}:${PORT}`);
});
