const express = require('express');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize data file if it doesn't exist
if (!fsSync.existsSync(DATA_FILE)) {
  fsSync.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Helper function to read data
async function readData() {
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Helper function to write data
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get all text entries
app.get('/api/entries', async (req, res) => {
  try {
    const entries = await readData();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read entries' });
  }
});

// Search text entries
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || '';
    const entries = await readData();
    
    if (!query) {
      return res.json(entries);
    }
    
    const results = entries.filter(entry => 
      entry.title.toLowerCase().includes(query) || 
      entry.content.toLowerCase().includes(query)
    );
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search entries' });
  }
});

// Get a specific entry
app.get('/api/entries/:id', async (req, res) => {
  try {
    const entries = await readData();
    const entry = entries.find(e => e.id === req.params.id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read entry' });
  }
});

// Create a new entry
app.post('/api/entries', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const entries = await readData();
    const newEntry = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    entries.push(newEntry);
    await writeData(entries);
    
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

// Update an entry
app.put('/api/entries/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const entries = await readData();
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
    
    await writeData(entries);
    res.json(entries[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

// Delete an entry
app.delete('/api/entries/:id', async (req, res) => {
  try {
    const entries = await readData();
    const filteredEntries = entries.filter(e => e.id !== req.params.id);
    
    if (entries.length === filteredEntries.length) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    await writeData(filteredEntries);
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
