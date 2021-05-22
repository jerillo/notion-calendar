require('dotenv').config({ path: './.env' });

const { Client } = require("@notionhq/client");

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
