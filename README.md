# Lotsoflex - Qwik Netflix Clone

A fully functional Netflix clone built with Qwik, featuring movie and TV show browsing, streaming, and search functionality.

## Features

- 🎬 Browse movies and TV shows
- 🔍 Search functionality
- 📺 Video streaming with multiple sources
- 📱 Responsive design
- ⚡ Fast loading with Qwik
- 🎯 TypeScript support

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- TMDB API key (get one at [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and add your TMDB API key:
   ```bash
   cp .env.example .env
   ```
   
4. Edit `.env` and add your TMDB API key:
   ```
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── banner/         # Hero banner component
│   ├── navbar/         # Navigation component
│   ├── row/            # Movie/TV show rows
│   ├── search-input/   # Search functionality
│   ├── streaming-providers/ # Streaming service info
│   └── video-player/   # Video player component
├── lib/                # Utility functions
├── routes/             # Page routes
│   ├── index.tsx       # Home page
│   ├── movies/         # Movies page
│   ├── tv-shows/       # TV shows page
│   ├── search/         # Search results
│   ├── movie/[id]/     # Individual movie pages
│   ├── tv/[id]/        # Individual TV show pages
│   ├── watch/[id]/     # Video player pages
│   └── my-list/        # User's saved content
└── types/              # TypeScript type definitions
```

## Environment Variables

- `VITE_TMDB_API_KEY`: Your TMDB API key (required)
- `VITE_APP_NAME`: Application name (default: "Lotsoflex")
- `VITE_APP_DESCRIPTION`: Application description

## Technologies Used

- **Qwik**: Fast web framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **TMDB API**: Movie and TV show data
- **Vite**: Build tool

## License

This project is for educational purposes only.