const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  const target = process.env.API_PROXY_TARGET || 'http://localhost:8787';
  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      onError(err, req, res) {
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
        }
        res.end(JSON.stringify({
          error: 'API server is unavailable',
          details: err?.code || err?.message || 'Proxy error',
          target
        }));
      }
    })
  );
};
