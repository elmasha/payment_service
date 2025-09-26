module.exports = {
  apps: [
    {
      name: "meatpro",
      script: "./meatpro.js",
      env: { PORT: 3001 }
    },
    {
      name: "yayalink",
      script: "./yayalink.js",
      env: { PORT: 3000 }
    },
    {
      name: "nginx",
      script: "nginx",
      interpreter: "none"
    }
  ]
};
