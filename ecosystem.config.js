module.exports = {
  apps: [
    {
      name: "meatpro",
      script: "./app/meatpro.js",
      env: { PORT: 3000 }
    },
    {
      name: "yayalink",
      script: "./app/yayalink.js",
      env: { PORT: 3001 }
    },
    {
      name: "nginx",
      script: "nginx",
      interpreter: "none"
    }
  ]
};
