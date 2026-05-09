const { Pool } = require('pg');

// Create a new pool using the connection string from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for platforms like Render/Neon that use self-signed certs
  }
});

// Initialize database
const initDb = async () => {
  const client = await pool.connect();
  try {
    // Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        merchant TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        type TEXT NOT NULL
      )
    `);
    console.log("Database table 'transactions' ensured.");

    // Check if empty
    const res = await client.query('SELECT COUNT(*) FROM transactions');
    if (parseInt(res.rows[0].count) === 0) {
      console.log("Database is empty. Seeding initial data...");
      
      const seedData = [
        ['Swiggy', 420, '2026-05-09T10:00:00.000Z', 'Food & Dining', 'expense'],
        ['Amazon', 1299, '2026-05-08T15:30:00.000Z', 'Shopping', 'expense'],
        ['Uber', 350, '2026-05-07T08:45:00.000Z', 'Travel', 'expense'],
        ['Netflix', 649, '2026-05-01T00:00:00.000Z', 'Subscription', 'expense'],
        ['Salary', 50000, '2026-05-01T09:00:00.000Z', 'Income', 'income']
      ];

      for (const row of seedData) {
        await client.query(
          'INSERT INTO transactions (merchant, amount, date, category, type) VALUES ($1, $2, $3, $4, $5)',
          row
        );
      }
      console.log("Seeding complete.");
    }
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
};

initDb();

module.exports = pool;
