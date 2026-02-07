# 🎬 ONI-CHAN - Anime Streaming Platform

A modern, full-stack anime streaming web application built with React and Node.js. Browse trending anime, search your favorites, and watch episodes seamlessly with an integrated video player.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js)

## ✨ Features

- 🏠 **Home Page** - Discover trending, top airing, and most popular anime
- 🔍 **Search** - Find anime by title with real-time results
- 📺 **Video Streaming** - Watch episodes via AnimeSuge integration
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development
- 🎨 **Modern UI** - Glassmorphism design with smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **TailwindCSS** - Utility-first CSS framework

### Backend
- **Node.js** - Runtime environment
- **Hono** - Fast web framework
- **Jikan API** - MyAnimeList data source
- **Redis** - Caching layer
- **Cheerio** - HTML parsing (for future scraping)

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Redis (optional, for caching)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/oni-chan.git
cd oni-chan
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd api-server
npm install
```

### 4. Environment Setup (Optional)
Create a `.env` file in the `api-server` directory if you want to configure Redis or other settings:
```env
PORT=3030
REDIS_URL=redis://localhost:6379
```

## 🎮 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd api-server
npm run dev
```
Backend will run on `http://localhost:3030`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

### Production Build

**Build Frontend:**
```bash
npm run build
```

**Start Backend:**
```bash
cd api-server
npm start
```

## 📁 Project Structure

```
oni-chan/
├── api-server/              # Backend API
│   ├── src/
│   │   ├── modules/         # API route handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # Route definitions
│   │   └── utils/           # Utility functions
│   └── index.js             # Server entry point
├── src/                     # Frontend source
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── api/                 # API client
│   └── App.jsx              # Main app component
└── README.md
```

## 🔌 API Endpoints

### Base URL: `http://localhost:3030/api/v1`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/home` | GET | Get home page data (trending, top airing) |
| `/search?keyword={query}&page={page}` | GET | Search anime by keyword |
| `/anime/{id}` | GET | Get anime details |
| `/episodes/{id}` | GET | Get episode list for anime |
| `/servers?id={episodeId}` | GET | Get available servers for episode |
| `/stream?id={episodeId}&server={server}` | GET | Get stream URL for episode |

## 🎨 Features in Detail

### Home Page
- Spotlight anime carousel
- Trending anime section
- Top airing shows
- Most popular anime

### Search
- Real-time search results
- Pagination support
- Anime posters and ratings
- Episode count display

### Video Player
- AnimeSuge iframe integration
- Server selection
- Episode navigation
- Fullscreen support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This project is for educational purposes only. All anime content is streamed from third-party sources (AnimeSuge). We do not host any content. Please support the official releases.

## 🙏 Acknowledgments

- [Jikan API](https://jikan.moe/) - MyAnimeList unofficial API
- [AnimeSuge](https://animesuge.cz/) - Video streaming source
- [Vite](https://vitejs.dev/) - Build tool
- [React](https://react.dev/) - UI library

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ by WhiskeyUwU 

