module.exports = {
  apps: [
    {
      name: "yayalink",
      script: "./app/yayalink.js",
      env: {
        PORT: 3000
      }
    },
    {
      name: "meatpro",
      script: "./app/meatpro.js",
      env: {
        PORT: 3001
      }
    },
    {
      name: "nginx",
      script: "/usr/sbin/nginx",
      args: ["-g", "daemon off;"]
    }
  ]
};
