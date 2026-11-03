import 'dotenv/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sendConfirmationHandler from './api/send-confirmation.js';

function localApiPlugin() {
  return {
    name: 'local-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/send-confirmation', (req, res) => {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            req.body = body ? JSON.parse(body) : {};
          } catch (_) {
            req.body = {};
          }
          const mockRes = {
            status(code) {
              res.statusCode = code;
              return this;
            },
            json(obj) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(obj));
            },
          };
          await sendConfirmationHandler(req, mockRes);
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
});
