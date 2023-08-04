// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const { createClient } = require('@supabase/supabase-js');
const port = 3000;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const pino = require('pino')({ destination: process.stdout });

app.post('/api/storeEmail', async (req, res) => {
    const { email } = req.body;
  
    try {
      const { data, error } = await supabase.from('emails').insert([{ email: email }]);
  
      if (error) {
        pino.error(error);
        return res.status(500).json({ error: 'Failed to save email address' });
      }
      pino.info('Data inserted successfully:', data);
      res.status(201).json({ message: 'Email address saved successfully' });
    } catch (error) {
      pino.error('Error:', error);
      res.status(500).json({ error: 'Failed to save email address' });
    }
  });

  const fs = require('fs');
  const path = require('path');

  app.post('/api/createRedirector', (req, res) => {
    const { subdirectory, redirectLink } = req.body;
  
    // Check if the specified subdirectory already exists
    const redirectorPath = path.join(subdirectory);
    if (fs.existsSync(redirectorPath)) {
      return res.status(400).json({ error: `Redirector for /${subdirectory} already exists.` });
    }
  
    // Create the HTML content for the redirector
    const htmlContent = `
    <!-- index.html -->
    <!DOCTYPE html>
    <html>
    <head>
      <title>Email Collection Form</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <div class="center">
        <div class="form-container">
          <h2 class="header">Enter your email address to continue to site:</h2>
          <form id="emailForm">
            <input type="email" id="email" name="email" required>
            <button type="submit">Submit</button>
          </form>
          <script>
            // script.js
            document.getElementById('emailForm').addEventListener('submit', async function(event) {
                event.preventDefault();
              
                const email = event.target.elements.email.value;
                const data = { email };
                console.log(email)
                console.log(data)
              
                try {
                  const response = await fetch('https://redirect-backend.onrender.com/api/storeEmail', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                  });
              
                  if (response.ok) {
                    // Read the redirect URL from local storage
                    const redirectURL = localStorage.getItem('redirectURL');
                    if (redirectURL) {
                      window.location.href = '${redirectLink}';
                    } else {
                      // If no redirect URL is set, use a default URL
                      window.location.href = 'https://aianswer.us'; // Replace with your desired link
                    }
                  } else {
                    alert('Failed to save email address. Please try again later.');
                  }
                } catch (error) {
                  console.error('Error:', error);
                  alert('Failed to save email address. Please try again later.');
                }
              });
          </script>
        </div>
      </div>
    </body>
    </html>
    `;
  
    // Write the HTML content to a new file under the specified subdirectory
    fs.writeFile(`${subdirectory}`, htmlContent, (err) => {
      if (err) {
        pino.error(`${redirectorPath}`)
        pino.error(err)
        return res.status(500).json({ error: 'Failed to create redirector.' });
      }
  
      res.status(200).json({ message: `Redirector for /${subdirectory} created successfully`, redirectLink });
    });
  });


app.listen(port, () => console.log(`Server running on port ${port}`));