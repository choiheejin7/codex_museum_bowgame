const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml' };
http.createServer((req,res) => {
 let url;
 try { url = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400); return res.end(); }
 const file = path.resolve(root, '.' + (url === '/' ? '/index.html' : url));
 if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
 fs.readFile(file, (err,bytes) => { if(err) {res.writeHead(404);return res.end('Not found');} res.writeHead(200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});res.end(bytes); });
}).listen(8080,'127.0.0.1', () => console.log('Museum game: http://localhost:8080'));
