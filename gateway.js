const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 8080;

// Proxy /yayalink → yayalink.js running on port 4001
app.use(
  "/yayalink",
  createProxyMiddleware({
    target: "http://localhost:3000",
    changeOrigin: true,
  })
);

// Proxy /meatpro → meatpro.js running on port 4002
app.use(
  "/meatpro",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
