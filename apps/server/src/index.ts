import 'dotenv/config';
import app from './app';
import { connectDatabase } from './config/database';
import { seedPuzzleUiTranslations } from './services/seed-puzzle-ui-translations';
import { seedLegacyPuzzleTitles } from './services/seed-puzzle-legacy-titles';

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDatabase();
    await seedPuzzleUiTranslations();
    await seedLegacyPuzzleTitles();

    app.listen(PORT, () => {
      console.log(`[v2] Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
