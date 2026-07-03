# Topics CRUD

A Vue 3 app for managing topics and comments. Load sample data, create/edit/delete topics, and manage comments with pagination and local storage.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer
- npm (included with Node.js)

## Installation

1. Clone or download this project, then open a terminal in the project folder:

   ```bash
   cd vue-topics-crud
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## How to Run

### Development (recommended)

Start the dev server with hot reload:

```bash
npm run dev
```

Open the URL shown in the terminal (usually **http://localhost:5173**).

### Production build

Build optimized static files:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Open the URL shown in the terminal (usually **http://localhost:4173**).

## Features

- **Topics** — List, create, edit, and delete topics (20 per page)
- **Comments** — Create, edit, and delete comments on each topic (3 shown at a time with “Show more”)
- **Modals** — Topic create/edit and delete confirmations use modal dialogs
- **Persistence** — Changes are saved to `localStorage` in the browser (cleared when you clear site data)

## Project Structure

```
src/
├── App.vue                 # Main app layout and topic state
├── components/
│   ├── AppModal.vue        # Reusable modal
│   ├── TopicPagination.vue # Topic list pagination
│   ├── topics/             # Topic list, card, and modals
│   └── comments/           # Comment list and items
├── data/topics.json        # Initial sample topics (100 items)
├── utils/topics.js         # Helpers (dates, GUID, localStorage)
└── styles/app.css          # Tailwind CSS and shared component styles
```

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start development server       |
| `npm run build`   | Build for production           |
| `npm run preview` | Serve the production build     |

## Data

On first load, the app reads from `src/data/topics.json`. After that, it uses data stored in `localStorage` under the key `vue-topics-crud-data`.

To reset to the original sample data, clear site data for localhost in your browser (or run `localStorage.removeItem('vue-topics-crud-data')` in the browser console) and refresh the page.
