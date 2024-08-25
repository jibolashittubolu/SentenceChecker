module.exports = {
  apps: [{
    name: "sentencechecker",
    script: "./dist/src/server.js",
    watch: ["./src", "./dist", "./prisma"],
    env_production: {
      NODE_ENV: "production",
    }
  }],
};
