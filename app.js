// app.js
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Parse JSON body
app.use(express.json());

// API endpoint to store email addresses in Supabase database
app.post('/api/storeEmail', async (req, res) => {
  const { email } = req.body;

  try {
    const { data, error } = await supabase.from('emails').insert([{ email }]);

    if (error) {
      console.error('Error saving email address:', error);
      return res.status(500).json({ error: 'Failed to save email address' });
    }

    res.status(201).json({ message: 'Email address saved successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to save email address' });
  }
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));