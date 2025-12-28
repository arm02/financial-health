const PROXY_CONFIG = {
  "/api": {
    target: "https://engine-financial.adrianmilano.my.id",
    secure: true,
    changeOrigin: true,
    logLevel: "debug",
    cookieDomainRewrite: "localhost",
    onProxyRes: function (proxyRes, req, res) {
      // Rewrite cookies to work with localhost
      const cookies = proxyRes.headers["set-cookie"];
      if (cookies) {
        proxyRes.headers["set-cookie"] = cookies.map((cookie) =>
          cookie
            .replace(/Domain=[^;]+;?/gi, "")
            .replace(/Secure;?/gi, "")
            .replace(/SameSite=None/gi, "SameSite=Lax")
        );
      }
    },
  },
};

module.exports = PROXY_CONFIG;
