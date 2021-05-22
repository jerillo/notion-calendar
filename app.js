require('dotenv').config({ path: './.env' });
const { loadCredentials } = require('./auth');
const { google, calendar_v3 } = require('googleapis');
const { Client } = require('@notionhq/client');
const databaseId = process.env.DATABASE_ID;

// Initializing a client
const notion = new Client({
	auth: process.env.NOTION_TOKEN
});

/**
 * Retrieves each row in Notion database and creates an object in accordance
 * with the expected Google Calendar event format.
 * @returns array of Google Calendar events to add
 */
const getEventsToAdd = async () => {
  try {
    const eventsToAdd = [];
		const response = await notion.databases.query({ database_id: databaseId });
		// Iterate through each element in the database
		response.results.forEach((elem) => {
			const prop = elem.properties;

			// Create values for event
			const title = `[${prop.Class.select.name}] ${prop.Name.title[0].plain_text}`;
			const start = new Date(prop.Dates.date.start).toISOString().split('T')[0];
			const end = new Date(prop.Dates.date.end || start).toISOString().split('T')[0];

			// Creates a description of the event using the `Type` and `Link` properties of the Notion element
			let description = `Type: ${prop.Type.select.name}`;
			if (prop.Link !== undefined) {
        const url = prop.Link.url;
				description = description.concat(`\n${url}`);
			}

			// Populate eventsToAdd array with relevant values for creating event
			eventsToAdd.push({
				summary: title,
				description: description,
				start: { date: start },
				end: { date: end }
			});
		});

    return eventsToAdd;
  } catch (error) {
    console.error({ error: error.message });
  }
}

/**
 * Retrieves each row in database and creates a corresponding event on Google Calendar. 
 */
const createEvents = async (auth, calendar, calendarId) => {
	try {
    const eventsToAdd = await getEventsToAdd();
    console.log(`eventsToAdd`, eventsToAdd);

		// Create Google Calendar event from each row in database.
		eventsToAdd.forEach((event) => {
			calendar.events.insert(
				{
					auth: auth,
					calendarId: calendarId,
					resource: event
				},
				(error, event) => {
					if (error) {
						console.error(error);
						return;
					}
					console.log('Event created: %s', event);
				}
			);
		});
	} catch (error) {
		console.error({ error: error.message });
		process.exit(1);
	}
};

/**
 * Initializes calendar variable for future use after authentication
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const initCalendar = async (auth) => {
	try {
		const calendar = google.calendar({ version: 'v3', auth });

		// Create new calendar to hold events generated from notion
		const newCalendar = await calendar.calendars.insert({
			requestBody: {
				summary: 'Notion Calendar'
			}
		});
		console.log('New Calendar', newCalendar.data);

		createEvents(auth, calendar, newCalendar.data.id);
	} catch (error) {
		console.error({ error: error.message });
	}
};

// Authenticates the user and creates events in the calendar.
loadCredentials(initCalendar);
