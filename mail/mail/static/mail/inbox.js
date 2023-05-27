document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-content-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-form').addEventListener('submit', send_email)
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-content-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3 class="mb-3">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Make a GET request to fetch the emails for the specified mailbox
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      console.log(emails)

      // Render each email
      emails.forEach(email => {
        const emailDiv = document.createElement('div');
        emailDiv.classList.add('email', 'p-3', 'mb-2', 'd-flex', 'align-items-center');
        emailDiv.innerHTML = `
          <div class="flex-grow-1">
            <p class="mb-1"><strong>From:</strong> ${email.sender}</p>
            <p class="mb-1"><strong>Subject:</strong> ${email.subject}</p>
            <p class="mb-1"><strong>Timestamp:</strong> ${email.timestamp}</p>
          </div>
          <div>
            <button class="btn btn-primary">Open</button>
          </div>
        `;

        // Set the background color based on the email's read status
        if (email.read) {
          emailDiv.classList.add('bg-light');
        } else {
          emailDiv.classList.add('bg-white');
        }

        // Add border and shadow to the email
        emailDiv.classList.add('border', 'rounded', 'shadow-sm');

        // Add click event listener to open the email
        emailDiv.addEventListener('click', () => open_email(email.id));

        document.querySelector('#emails-view').appendChild(emailDiv);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}



// Create send_email function
function send_email(event) {
  // Prevent form from submitting normally
  event.preventDefault();

  // Send a post request to the server and send the email
  fetch('/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // Making these values into JSON so it can be processed
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

    load_mailbox('sent');
}

// Function to open email
function open_email(emailId) {
  // Fetch email content
  fetch(`emails/${emailId}`)
    .then(response => response.json())
    .then(email => {
      // Hide other views and show the email content view
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#email-content-view').style.display = 'block';

      // Update the email content view
      const emailContentView = document.querySelector('#email-content-view');
      emailContentView.innerHTML = `
        <div class="email-details">
          <div class="mb-3">
            <strong>From:</strong> ${email.sender}
          </div>
          <div class="mb-3">
            <strong>To:</strong> ${email.recipients}
          </div>
          <div class="mb-3">
            <strong>Subject:</strong> ${email.subject}
          </div>
          <div class="mb-3">
            <strong>Timestamp:</strong> ${email.timestamp}
          </div>
          <div class="email-body mb-3">
            <strong>Body:</strong>
            <textarea class="form-control" rows="3" readonly>${email.body}</textarea>
          </div>
        </div>
      `;

      // Add "Reply" button to the email content view
      const replyButton = document.createElement('button');
      replyButton.textContent = 'Reply';
      replyButton.classList.add('btn', 'btn-primary', 'mb-3');
      emailContentView.appendChild(replyButton);

      // Attach click-event listener to the "Reply" button 
      replyButton.addEventListener('click', () => {
        // load the compose view
        compose_email();

        // Pre-fill the recipient, subject, and body fields
        const composeRecipients = document.querySelector('#compose-recipients');
        const composeSubject = document.querySelector('#compose-subject');
        const composeBody = document.querySelector('#compose-body');

        // Pre-fill the recipient field with the original sender
        composeRecipients.value = email.sender;

        // Pre-fill the subject field
        if (email.subject.startsWith('Re:')) {
          composeSubject.value = email.subject;
        } else {
          composeSubject.value = `Re: ${email.subject}`;
        }

        // Pre-fill the body field with the original mail content
        const originalContent = `On ${email.timestamp} ${email.sender} wrote:\n${email.body}`;
        composeBody.value = originalContent;
      });

      // Create archive/unarchive button based on mailbox
      const archiveBtn = document.createElement('button');
      if (email.archived) {
        archiveBtn.innerText = 'Unarchive';
        archiveBtn.id = 'unarchive-btn';
        archiveBtn.classList.add('btn', 'btn-primary', 'mb-3');
      } else {
        archiveBtn.innerText = 'Archive';
        archiveBtn.id = 'archive-btn';
        archiveBtn.classList.add('btn', 'btn-primary', 'mb-3');
      }


      // Add event listener to archive/unarchive button
      archiveBtn.addEventListener('click', () => {
        const isArchived = email.archived;
        mark_email_as_archived(emailId, !isArchived);
      });

      // Append the button to the email content view
      emailContentView.appendChild(archiveBtn);

      // Mark the email as read
      mark_email_as_read(emailId);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


// Function to mark the email as archived or unarchived
function mark_email_as_archived(emailId, isArchived) {
  // Send a PUT request to update the email's archived status
  fetch(`/emails/${emailId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      archived: isArchived
    })
  })
  // Check if the request was successful
  .then(response => {
    if (response.ok) {
      console.log(`Email ${isArchived ? 'archived' : 'unarchived'}`);
      load_mailbox('inbox');
    } else {
      // Throw an error if the request fails
      throw new Error(`Failed to ${isArchived ? 'archive' : 'unarchive'} email`);
    }
  })
  .catch(error => {
    console.error('Error:', error)
  });
}

// Function to mark the email as read
function mark_email_as_read(emailId) {
  fetch(`/emails/${emailId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      read: true
    })
  })
    .then(response => {
      if (response.ok) {
        console.log('Email marked as read');
      } else {
        throw new Error('Failed to mark email as read');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}