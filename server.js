import fs from 'node:fs/promises';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { createServer } from "vite";

const port = 5173;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function initServer() {
    const app = express();

    const vite = await createServer({
        server: {
            middlewareMode: true
        },
        appType: 'custom'
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
        try {
            const url = req.originalUrl;

            let template = await fs.readFile('./dist/client/index.html', 'utf-8');
            template = await vite.transformIndexHtml(url, template);

            //const { rend } = await vite.ssrLoadModule('./main.js');
            const { rend } = import('./dist/server/server.js');
            const appHtml = await rend(url);

            const html = template.replace('<!--THE-PART-WHERE-TO-INJECT-->', appHtml);

            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.write(html);
            res.end();
        } catch (e) {
            vite?.ssrFixStacktrace(e);
            console.log(e.stack);
            res.status(500).end(e.stack);
        }
    });

    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
}

app.get('/api/hello', (res, req) => {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.write(JSON.stringify({ hello: "world" }));
    res.end();
});

// Start server
initServer();