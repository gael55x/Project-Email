# Project-eMail

A front-end and back-end email system designed for sending and receiving emails through API calls. It's a single page application. All emails sent and received be stored exclusively within the user's database. They will not be transmitted to real email servers. Users have the freedom to select any desired email address (e.g., bob@gmail.com) and password for this project. It is not mandatory for the credentials chosen to be valid or associated with real email addresses.

## Backend Framework

The project utilizes Django as the backend framework for creating the web application.

## Setup and Server

To set up the database, apply migrations, and start the web server, run the following command: `python manage.py runserver`.

## Single-Page Application

The web application is built as a single-page application, with JavaScript handling the user interface.

## Routing and Views

The default route in `mail/urls.py` loads the `index` function in `views.py`, which renders the `mail/inbox.html` template if the user is signed in.

## Email Client Template

The `inbox.html` template displays the user's email address, navigation buttons, and two main sections: `emails-view`, `email-content-view`, and `compose-view`.

## JavaScript Functionality

 The JavaScript file `inbox.js` attaches event listeners to buttons and controls the visibility of different views (`emails-view`, `email-content-view`, and `compose-view`).

## Email Loading

The `load_mailbox` function is called when a mailbox button is clicked and displays the emails in the selected mailbox.

## API Routes

The web application utilizes the following API routes to interact with the backend:

- `GET /emails/<str:mailbox>`: Retrieves a list of emails in the specified mailbox.
- `GET /emails/<int:email_id>`: Retrieves a JSON representation of the email with the given ID.
- `POST /emails`: Sends a new email by providing recipients, subject, and body in the request body.
- `PUT /emails/<int:email_id>`: Updates the status of an email, such as marking it as read/unread or archived/unarchived.

## Additional Features

The project includes the following additional features:

- **Send Mail**: When a user submits the email composition form, JavaScript code is implemented to send the email. This involves making a POST request to the /emails endpoint and providing the recipients, subject, and body in the request body. After sending the email, the user's sent mailbox is loaded.

- **Mailbox**:  Users can access their Inbox, Sent mailbox, or Archive. Each mailbox is loaded by making a GET request to the /emails/<mailbox> endpoint to retrieve the corresponding emails. Upon visiting a mailbox, the application queries the API to fetch the latest emails. The mailbox name is displayed at the top of the page. Emails are presented in individual boxes with details such as the sender, subject line, and timestamp. Unread emails are shown with a white background, while read emails have a gray background.

- **View Email**: Clicking on an email takes the user to a dedicated view displaying the email's content. This is achieved by making a GET request to the /emails/<email_id> endpoint to fetch the specific email. The view presents information such as the sender, recipients, subject, timestamp, and body of the email. To facilitate this, an additional <div> element is added to the inbox.html template. The visibility of different views is managed to show the appropriate sections when navigation options are clicked. When an email is accessed, it is marked as read by sending a PUT request to the /emails/<email_id> endpoint.

- **Archive and Unarchive**: Users can easily archive or unarchive received emails. When viewing an email in the Inbox, an "Archive" button is provided to archive the email. Similarly, when viewing an email in the Archive, an "Unarchive" button is available to unarchive the email. This functionality does not apply to emails in the Sent mailbox. Archiving or unarchiving an email involves sending a PUT request to the /emails/<email_id> endpoint. After performing the action, the user's inbox is reloaded.

- **Reply**: Users can reply to an email directly from the email view. The email view presents a "Reply" button that, when clicked, takes the user to the email composition form. The form is pre-filled with the recipient field set to the original email's sender. The subject line is also pre-filled, with "Re: " added to the beginning if it doesn't already start with "Re: ". Additionally, the body of the email is pre-filled with a line like "On Jan 1, 2020, 12:00 AM, bob@gmail.com wrote:", followed by the original text of the email.

## How to Run in VSC
To run the Project-Auctions web app in Visual Studio Code (VSC), follow these steps:

1. Make a virtual environment by executing the following command in your terminal:
  - **python3 -m venv venv**

2. Activate the virtual environment by running the appropriate command based on your operating system:
   - **Windows**:
      venv\Scripts\activate
   - **MacOS/Linux**:
      source venv/bin/activate
      
3. If you haven't installed virtualenv, use the following command:
  pip install virtualenv
  
  
Now you can proceed with setting up and running the Project-eMail web app in VSC.
