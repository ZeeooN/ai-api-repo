import fs from 'node:fs/promises';
import express from 'express';
import { createServer } from 'vite';

// Server port.
const port = 5713;

// Function to initialize the server.
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
            console.log(req.originalUrl);

            let template = await fs.readFile('./dist/client/index.html', 'utf-8');
            template = await vite.transformIndexHtml(url, template);

            const { rend } = (await vite.ssrLoadModule('./server.js')).render;
            //const { rend } = import('./dist/server/server.js');

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

// Call 'initServer' function to launch the server.
initServer();