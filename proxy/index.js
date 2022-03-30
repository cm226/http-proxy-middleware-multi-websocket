import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// ----------------------------------------------------
const ws1_url = '/websocket1';
const websocket1 = createProxyMiddleware({
  target: 'http://localhost:1234',
  pathRewrite: { [`^${ws1_url}`]: '/' },
  changeOrigin: true,
  ws: true,
});
app.use(ws1_url, websocket1);

// ----------------------------------------------------
const ws2_url = '/websocket2';
const websocket2 = createProxyMiddleware({
  target: 'http://localhost:5678',
  pathRewrite: { [`^${ws2_url}`]: '/' },
  changeOrigin: true,
  ws: true,
});
app.use(ws2_url, websocket2);

// ----------------------------------------------------

const auth = '/page';
app.use(
  auth,
  createProxyMiddleware({
    target: 'http://localhost:3000',
    pathRewrite: { [`^${auth}`]: '/' },
    changeOrigin: true,
  })
);


const server = app.listen(8080);

server.on('upgrade',  websocket2.upgrade);
// server.on('upgrade', (req, socket, head) => {
//   if (websocket1.upgrade && req.url.includes(ws1_url)) {
//     websocket1.upgrade(req, socket, head);
//   } else if (websocket2.upgrade && req.url.includes(ws2_url)) {
//     websocket2.upgrade(req, socket, head);
//   }
// });
