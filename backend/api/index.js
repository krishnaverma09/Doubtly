const serverless = require("serverless-http");
const { app } = require("../src/app");

// Export a serverless handler for Vercel
module.exports = serverless(app);
