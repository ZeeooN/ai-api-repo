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
            // Stores the current requests url
            const url = req.originalUrl;

            if ((url !== '/index.html') && (url !== '/story-view.html') && (url !== '/')) {
                // This is the part that gets executed if an api call or smth like that.
                next();
            } else {
                // This is where the rendered pages should get processed if ssr is used.
                let template = await fs.readFile('./dist/client/index.html', 'utf-8');
                template = await vite.transformIndexHtml(url, template);

                // TODO: Server side loading should be fixed. Or an alternative method of injecting html should be used.
                //const { rend } = (await vite.ssrLoadModule('./server.js')).render;
                //const { rend } = import('./dist/server/server.js');
                //const appHtml = await rend(url);
                //const html = template.replace('<!--THE-PART-WHERE-TO-INJECT-->', appHtml);
                const html = template;

                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.write(html);
                res.end();
            }
        } catch (e) {
            vite?.ssrFixStacktrace(e);
            console.log(e.stack);
            res.status(500).end(e.stack);
        }
    });

    // A possible way how an api call could be made!?
    app.get('/hello', (req, res) => {
        res.setHeader('Content-Type', 'application/json').writeHead(200);
        res.write(JSON.stringify({ Hello: "World" }));
        res.end();
    });

    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
}

// Call 'initServer' function to launch the server.
initServer();