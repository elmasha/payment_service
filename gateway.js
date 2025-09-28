const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 8080;




/////-----Home ------/////
app.get("/", (req, res, next) => {
    res.status(200).send("Hello welcome to INTEC - Mpesa payment gateway");
});



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


// Proxy /dukalink → dukalink.js running on port 4002
app.use(
  "/dukalink",
  createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
  })
);

// Proxy /dukalink → dukalink.js running on port 4002
app.use(
  "/swiftgas",
  createProxyMiddleware({
    target: "http://localhost:3004",
    changeOrigin: true,
  })
);


app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
