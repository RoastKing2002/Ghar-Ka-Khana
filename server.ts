import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('kitchen.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    day TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const initialInventory = [
  // Monday
  { id: 'mon-1', name: 'Paneer Bhurji Meal', category: 'Monday', price: 149, stock: 50, day: 'Monday' },
  { id: 'mon-2', name: 'Moong Dal & Jeera Aloo Meal', category: 'Monday', price: 119, stock: 50, day: 'Monday' },
  { id: 'mon-3', name: 'Pulao & Raita', category: 'Monday', price: 99, stock: 50, day: 'Monday' },
  // Tuesday
  { id: 'tue-1', name: 'Paneer Bhurji Meal', category: 'Tuesday', price: 149, stock: 50, day: 'Tuesday' },
  { id: 'tue-2', name: 'Moong Dal & Jeera Aloo Meal', category: 'Tuesday', price: 119, stock: 50, day: 'Tuesday' },
  { id: 'tue-3', name: 'Dal & Nutri Meal', category: 'Tuesday', price: 129, stock: 50, day: 'Tuesday' },
  { id: 'tue-4', name: 'Black Chane Rice Box', category: 'Tuesday', price: 99, stock: 50, day: 'Tuesday' },
  // Wednesday
  { id: 'wed-1', name: 'Paneer Bhurji Meal', category: 'Wednesday', price: 149, stock: 50, day: 'Wednesday' },
  { id: 'wed-2', name: 'Moong Dal & Jeera Aloo Meal', category: 'Wednesday', price: 119, stock: 50, day: 'Wednesday' },
  { id: 'wed-3', name: 'Aloo Gobhi Raita Meal', category: 'Wednesday', price: 129, stock: 50, day: 'Wednesday' },
  { id: 'wed-4', name: 'Dal & Aloo Gobhi Meal', category: 'Wednesday', price: 119, stock: 50, day: 'Wednesday' },
  // Thursday
  { id: 'thu-1', name: 'Paneer Bhurji Meal', category: 'Thursday', price: 149, stock: 50, day: 'Thursday' },
  { id: 'thu-2', name: 'Moong Dal & Jeera Aloo Meal', category: 'Thursday', price: 119, stock: 50, day: 'Thursday' },
  { id: 'thu-3', name: 'Kadhi Rice Box', category: 'Thursday', price: 99, stock: 50, day: 'Thursday' },
  // Friday
  { id: 'fri-1', name: 'Paneer Bhurji Meal', category: 'Friday', price: 149, stock: 50, day: 'Friday' },
  { id: 'fri-2', name: 'Moong Dal & Jeera Aloo Meal', category: 'Friday', price: 119, stock: 50, day: 'Friday' },
  { id: 'fri-3', name: 'Dal & Mix Veg Meal', category: 'Friday', price: 129, stock: 50, day: 'Friday' },
  { id: 'fri-4', name: 'Rajma Rice Box', category: 'Friday', price: 99, stock: 50, day: 'Friday' },
  // Saturday
  { id: 'sat-1', name: 'Paneer Bhurji Meal', category: 'Saturday', price: 149, stock: 50, day: 'Saturday' },
  { id: 'sat-2', name: 'Moong Dal & Jeera Aloo Meal', category: 'Saturday', price: 119, stock: 50, day: 'Saturday' },
  { id: 'sat-3', name: 'White chana rice box', category: 'Saturday', price: 99, stock: 50, day: 'Saturday' },
  { id: 'sat-4', name: 'Jeera Aloo & Raita Meal', category: 'Saturday', price: 99, stock: 50, day: 'Saturday' },
  // Sunday
  { id: 'sun-1', name: 'Paneer bhurji meal', category: 'Sunday', price: 149, stock: 50, day: 'Sunday' },
  { id: 'sun-2', name: 'Moong dal & jeera aloo meal', category: 'Sunday', price: 119, stock: 50, day: 'Sunday' },
  { id: 'sun-3', name: 'Pav bhaji meal', category: 'Sunday', price: 119, stock: 50, day: 'Sunday' },
  { id: 'sun-4', name: 'Poori chole', category: 'Sunday', price: 119, stock: 50, day: 'Sunday' },
  // Accompaniments
  { id: 'acc-1', name: 'Boondi Raita', category: 'Accompaniments', price: 40, stock: 100, day: null },
  { id: 'acc-2', name: 'Mix Raita', category: 'Accompaniments', price: 40, stock: 100, day: null },
  // Snacks
  { id: 'snk-1', name: 'Veg Maggi', category: 'Snacks', price: 75, stock: 100, day: null },
  { id: 'snk-2', name: 'French Fries', category: 'Snacks', price: 50, stock: 100, day: null },
  { id: 'snk-3', name: 'Veg Wrap', category: 'Snacks', price: 110, stock: 100, day: null },
  { id: 'snk-4', name: 'Paneer Wrap', category: 'Snacks', price: 135, stock: 100, day: null },
  { id: 'snk-5', name: 'Veg Grilled Sandwich (Small)', category: 'Snacks', price: 50, stock: 100, day: null },
  { id: 'snk-6', name: 'Veg Grilled Sandwich (Large)', category: 'Snacks', price: 95, stock: 100, day: null },
  { id: 'snk-7', name: 'Paneer Grilled Sandwich (Small)', category: 'Snacks', price: 90, stock: 100, day: null },
  { id: 'snk-8', name: 'Paneer Grilled Sandwich (Large)', price: 150, category: 'Snacks', stock: 100, day: null },
  { id: 'snk-9', name: 'Veg Burger', category: 'Snacks', price: 70, stock: 100, day: null },
  { id: 'snk-10', name: 'Paneer Burger', category: 'Snacks', price: 90, stock: 100, day: null },
  // Prantha Meals
  { id: 'prn-1', name: 'Aloo Prantha Combo', category: 'Prantha Meals', price: 139, stock: 100, day: null },
  { id: 'prn-2', name: 'Gobhi Prantha Combo', category: 'Prantha Meals', price: 149, stock: 100, day: null },
  { id: 'prn-3', name: '1 Aloo Paratha', category: 'Prantha Meals', price: 50, stock: 100, day: null },
  { id: 'prn-4', name: '1 Gobhi Paratha', category: 'Prantha Meals', price: 55, stock: 100, day: null },
  { id: 'prn-5', name: '1 Mix Paratha', category: 'Prantha Meals', price: 65, stock: 100, day: null },
  { id: 'prn-6', name: 'Tawa Roti', category: 'Prantha Meals', price: 12, stock: 500, day: null },
  { id: 'prn-7', name: 'Tawa Butter Roti', category: 'Prantha Meals', price: 15, stock: 500, day: null },
  { id: 'prn-8', name: 'Plain Paratha', category: 'Prantha Meals', price: 20, stock: 500, day: null },
];

const insertInventory = db.prepare('INSERT OR IGNORE INTO inventory (id, name, category, price, stock, day) VALUES (?, ?, ?, ?, ?, ?)');
initialInventory.forEach(item => {
  insertInventory.run(item.id, item.name, item.category, item.price, item.stock, item.day);
});

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/inventory', (req, res) => {
    const items = db.prepare('SELECT * FROM inventory').all();
    res.json(items);
  });

  app.post('/api/inventory/update', (req, res) => {
    const { id, stock } = req.body;
    db.prepare('UPDATE inventory SET stock = ? WHERE id = ?').run(stock, id);
    res.json({ success: true });
  });

  app.get('/api/orders', (req, res) => {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items) })));
  });

  app.post('/api/orders', (req, res) => {
    const { customer_name, items, total } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    
    // Check stock and update
    const updateStock = db.transaction((orderItems) => {
      for (const item of orderItems) {
        const current = db.prepare('SELECT stock FROM inventory WHERE id = ?').get(item.id);
        if (!current || current.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }
        db.prepare('UPDATE inventory SET stock = stock - ? WHERE id = ?').run(item.quantity, item.id);
      }
      db.prepare('INSERT INTO orders (id, customer_name, items, total) VALUES (?, ?, ?, ?)').run(
        id, customer_name, JSON.stringify(items), total
      );
    });

    try {
      updateStock(items);
      res.json({ success: true, orderId: id });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/orders/status', (req, res) => {
    const { id, status } = req.body;
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://localhost:3000');
  });
}

startServer();
