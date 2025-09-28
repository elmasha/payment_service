module.exports = {
  apps: [
    {
      name: "gateway",
      script: "gateway.js",
      node_args: "--trace-deprecation",
      watch: false
    },
    {
      name: "yayalink",
      script: "yayalink.js",
      node_args: "--trace-deprecation",
      watch: false
    },
    {
      name: "meatpro",
      script: "meatpro.js",
      node_args: "--trace-deprecation",
      watch: false
    },
    
    {
      name: "dukalink",
      script: "dukalink.js",
      node_args: "--trace-deprecation",
      watch: false
    },
     {
      name: "swiftgas",
      script: "swiftgas.js",
      node_args: "--trace-deprecation",
      watch: false
    },
    {
      name: "contest",
      script: "contest.js",
      node_args: "--trace-deprecation",
      watch: false
    },
  ],
};
