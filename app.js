// app.js
require('dotenv').config();
const express = require('express');
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


app.listen(port, () => console.log(`Server running on port ${port}`));