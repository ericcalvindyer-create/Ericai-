const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Helper function to read data
function readData() {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Helper function to write data
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get all text entries
app.get('/api/entries', (req, res) => {
  const entries = readData();
  res.json(entries);
});

// Search text entries
app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const entries = readData();
  
  if (!query) {
    return res.json(entries);
  }
  
  const results = entries.filter(entry => 
    entry.title.toLowerCase().includes(query) || 
    entry.content.toLowerCase().includes(query)
  );
  
  res.json(results);
});

// Get a specific entry
app.get('/api/entries/:id', (req, res) => {
  const entries = readData();
  const entry = entries.find(e => e.id === req.params.id);
  
  if (!entry) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  
  res.json(entry);
});

// Create a new entry
app.post('/api/entries', (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  
  const entries = readData();
  const newEntry = {
    id: Date.now().toString(),
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  entries.push(newEntry);
  writeData(entries);
  
  res.status(201).json(newEntry);
});

// Update an entry
app.put('/api/entries/:id', (req, res) => {
  const { title, content } = req.body;
  const entries = readData();
  const index = entries.findIndex(e => e.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  
  entries[index] = {
    ...entries[index],
    title: title || entries[index].title,
    content: content || entries[index].content,
    updatedAt: new Date().toISOString()
  };
  
  writeData(entries);
  res.json(entries[index]);
});

// Delete an entry
app.delete('/api/entries/:id', (req, res) => {
  const entries = readData();
  const filteredEntries = entries.filter(e => e.id !== req.params.id);
  
  if (entries.length === filteredEntries.length) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  
  writeData(filteredEntries);
  res.json({ message: 'Entry deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
