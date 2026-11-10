import 'dotenv/config';
import app from './app';
import { connectDatabase } from './config/database';
import { seedPuzzleUiTranslations } from './services/seed-puzzle-ui-translations';

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDatabase();
    await seedPuzzleUiTranslations();

    app.listen(PORT, () => {
      console.log(`[v2] Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
