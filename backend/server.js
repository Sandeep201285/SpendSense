const express = require('express');
const cors = require('cors');
const pool = require('./db'); // This is now the Postgres pool
const { parseMessage } = require('./aiParser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Get all transactions
app.get('/transactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY date DESC');
    // Convert id to string to match frontend expectations
    const formattedRows = result.rows.map(r => ({ ...r, id: r.id.toString() }));
    res.json(formattedRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Add a new transaction
app.post('/transactions', async (req, res) => {
  const { merchant, amount, date, category, type } = req.body;
  if (!merchant || !amount || !date || !category || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO transactions (merchant, amount, date, category, type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [merchant, amount, date, category, type]
    );
    
    const newTx = result.rows[0];
    res.status(201).json({
      ...newTx,
      id: newTx.id.toString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Parse SMS/Email message via AI
app.post('/parse-message', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Missing text parameter' });
  }

  try {
    const parsedData = await parseMessage(text);
    
    const result = await pool.query(
      'INSERT INTO transactions (merchant, amount, date, category, type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [parsedData.merchant, parsedData.amount, parsedData.date, parsedData.category, parsedData.type]
    );
    
    const newTx = result.rows[0];
    res.status(201).json({
      ...newTx,
      id: newTx.id.toString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
