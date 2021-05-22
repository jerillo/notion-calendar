# Notion Calendar

Playing around with Notion's API
###### Author: Jesnine Erillo

---

## References

- Notion API Reference: [https://developers.notion.com/reference](https://developers.notion.com/reference)
- Google Calendar API Reference: [https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Calendar.html](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Calendar.html)

## Running Locally

This utilizes Google Calendar API for Node.js. Use these resources to setup this command-line app:

- Create a client secret JSON file called `credentials.json`. Follow the steps here: [Create Desktop application credentials](https://developers.google.com/workspace/guides/create-credentials#desktop)
- Authorize the app by running

    ```bash
    node auth.js
    ```

## Usage Limits

There are usage limits that limits how frequently I can use the Google Calendar API, including the number of events I can create :(
