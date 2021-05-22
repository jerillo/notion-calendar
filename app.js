require('dotenv').config({ path: './.env' });

const { Client } = require("@notionhq/client");
const databaseId = process.env.DATABASE_ID;

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

/**
 * Retrieves each row in database. 
 */
const retrieveDB = async () => {
  try {
    const eventsToAdd = [];
    const response = await notion.databases.query({ database_id: databaseId });
    // Iterate through each element in the database and print properties
    response.results.forEach(elem => {
      const vals = {
        title: elem.properties.Name.title[0].plain_text,
        date: elem.properties.Dates.date
      }
      eventsToAdd.push(vals);
    });
    console.log(`Events to be added:`, eventsToAdd)
    
    // TODO: Create Google Calendar event from each row in database.

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

retrieveDB()