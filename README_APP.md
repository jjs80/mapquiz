# MapQuiz - Geography Quiz Application

A web-based geography quiz application where users can test their knowledge of world countries and cities by clicking on an interactive map.

## Features

- **Two Quiz Modes:**
  - **Country Mode**: Identify countries by their location on the map
  - **City Mode**: Identify world cities, including capitals and major cities

- **Bilingual Support:**
  - Questions and UI available in English and Finnish

- **Customizable Quiz:**
  - Select which regions to include (Europe, Asia, Africa, Americas, Oceania)
  - Choose difficulty level (Easy, Normal, Hard)
  - Set number of questions (10, 20, or 50)

- **Interactive World Map:**
  - SVG-based map using D3.js
  - Hover effects for countries and cities
  - Real-time feedback on correct/incorrect answers
  - Responsive design

- **Data Coverage:**
  - ~195 countries with borders
  - 400+ cities including all world capitals and major cities
  - Bilingual names for all entries

## Project Structure

```
src/
├── components/
│   ├── WorldMap/          # D3-based map component
│   ├── Quiz/              # Quiz UI components
│   ├── Settings/          # Settings panel
│   └── UI/                # Reusable UI components
├── data/
│   ├── countries.json     # Country data
│   ├── cities.json        # City data
│   └── regions.json       # Region groupings
├── hooks/
│   ├── useMapProjection.ts  # D3 projection setup
│   └── useQuizEngine.ts     # Quiz logic
├── store/
│   ├── settingsStore.ts   # Settings state (Zustand)
│   └── quizStore.ts       # Quiz state (Zustand)
├── utils/
│   ├── shuffle.ts         # Array shuffling
│   └── filterByRegion.ts  # Data filtering
├── i18n/
│   ├── en.ts              # English translations
│   └── fi.ts              # Finnish translations
├── App.tsx                # Main application component
└── index.css              # Tailwind CSS
```

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Map Visualization:** D3.js + TopoJSON
- **Map Data:** world-atlas
- **i18n:** Custom key-value system

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mapquiz
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Features in Detail

### Quiz Modes

#### Country Mode
- Users see a country name in English and Finnish
- Click on the corresponding country on the map
- Provides immediate feedback with correct answer if wrong

#### City Mode
- Users see a city name in English and Finnish
- Click on the city marker (dot) on the map
- Capital cities shown as larger dots (radius 5px)
- Major cities shown as smaller dots (radius 3px)

### Difficulty Levels

- **Easy:** Features the 50 most recognizable/largest countries or major capitals only
- **Normal:** All ~195 countries or all capitals
- **Hard:** All countries including territories or all capitals + major cities

### Regional Filtering

Users can select which regions to include in their quiz:
- Europe (5 subregions)
- Asia (5 subregions)
- Africa (5 subregions)
- Americas (4 subregions)
- Oceania

### Game Flow

1. **Start Screen:** Display app info with option to quick start or customize
2. **Settings:** Configure quiz parameters
3. **Quiz:** Interactive map with floating question panel
4. **Results:** Final score with option to replay or change settings

## Data Sources

- **Country Borders:** world-atlas (Natural Earth 110m resolution)
- **Country Names:** ISO 3166-1 + Manual Finnish translations  
- **World Capitals:** Traditional public domain dataset
- **Major Cities:** Derived from population data
- **Finnish Translations:** Manually curated for accuracy

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- User accounts and score tracking
- Leaderboards
- Time-based challenges
- More language support
- Administrative regions mode
- Sound effects and background music
- Keyboard shortcuts
- Export quiz results

## Development Notes

### Adding New Regions

Edit `src/data/regions.json` and update the countries data with the corresponding region tags.

### Updating Translations

Edit translation files:
- `src/i18n/en.ts` for English
- `src/i18n/fi.ts` for Finnish

### Modifying Quiz Questions

The quiz questions are dynamically generated from `src/data/countries.json` and `src/data/cities.json`. Update these files to change available questions.

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.
