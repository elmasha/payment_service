module.exports = {
  apps: [
    {
      name: "yayalink",
      script: "yayalink/server.js",  // change if your entry file differs
      env: { PORT: 3000 }
    },
    {
      name: "meatpro",
      script: "meatpro/server.js",  // change if your entry file differs
      env: { PORT: 3001 }
    },
    {
      name: "nginx",
      script: "/usr/sbin/nginx",
      args: ["-g", "daemon off;"]
    }
  ]
};
