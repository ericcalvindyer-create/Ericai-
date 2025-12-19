# Collaborative Text Editor

A simple, searchable collaborative text editing website designed for groups to share and edit text content together.

## Features

- ✏️ **Create, Edit, Delete** - Full CRUD operations for text entries
- 🔍 **Powerful Search** - Search through all entries by title or content
- 👥 **Collaborative** - Multiple people can use and edit the same content
- 📱 **Responsive Design** - Clean, simple interface that works on any device
- 💾 **Persistent Storage** - All data is saved to a local JSON file

## Getting Started

### Prerequisites

- Node.js (version 12 or higher)
- npm (comes with Node.js)

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### Creating an Entry
1. Enter a title and content in the editor section
2. Click "Save Entry"

### Searching Entries
1. Type your search query in the search bar
2. Click "Search" or press Enter
3. Results will show entries matching the query in title or content

### Editing an Entry
1. Click the "Edit" button on any entry
2. Modify the title or content
3. Click "Save Entry"

### Deleting an Entry
1. Click the "Delete" button on any entry
2. Confirm the deletion

## Technical Details

### Architecture
- **Backend**: Node.js with Express.js
- **Frontend**: Vanilla HTML, CSS, and JavaScript
- **Storage**: File-based JSON storage (data.json)

### API Endpoints

- `GET /api/entries` - Get all entries
- `GET /api/entries/:id` - Get a specific entry
- `GET /api/search?q=query` - Search entries
- `POST /api/entries` - Create a new entry
- `PUT /api/entries/:id` - Update an entry
- `DELETE /api/entries/:id` - Delete an entry

## Data Storage

All text entries are stored in a `data.json` file in the root directory. This file is automatically created when the server starts for the first time.

## Security Note

This application is designed for internal, trusted group use and does not include authentication or authorization mechanisms. All users have full read and write access to all content.

## License

MIT
