import { processOfflineStats } from '../services/tamagotchi/offline.service';
import { calculateBattlePower, determineWinner } from '../services/tamagotchi/battle-rule.service';
import { checkAndUnlockTitles } from '../services/tamagotchi/title.service';
import { ITamagotchi } from '../models/tamagotchi.model';

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
  console.log(`✅ [PASS] ${message}`);
};

const runTests = () => {
  console.log('--- STARTING TAMAGOTCHI UNIT TESTS ---');

  // Test 1: Offline stat decrease calculation
  const mockTama = {
    isDead: false,
    isRetired: false,
    lastInteractionAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    stats: {
      happiness: 50,
      hunger: 50,
      cleanliness: 100,
      courage: 10,
    },
    deathTimerStartAt: null,
  } as unknown as ITamagotchi;

  processOfflineStats(mockTama);
  
  // Happiness should lose 5 * 5 = 25 -> 25
  // Hunger should lose 5 * 4 = 20 -> 30
  // Cleanliness should lose 5 * 4 = 20 -> 80
  assert(mockTama.stats.happiness === 25, 'Happiness correctly decreased by 25');
  assert(mockTama.stats.hunger === 30, 'Hunger correctly decreased by 20');
  assert(mockTama.stats.cleanliness === 80, 'Cleanliness correctly decreased by 20');

  // Test 2: Battle power formula
  const mockTama2 = {
    stats: {
      happiness: 80,
      hunger: 60,
      cleanliness: 70,
      courage: 40,
    },
  } as unknown as ITamagotchi;

  const power = calculateBattlePower(mockTama2);
  // Power = 80 + 60 + 70 + (40 * 1.5) = 270
  assert(power === 270, `Battle power correctly calculated (Expected 270, got ${power})`);

  // Test 3: Title unlocking conditions
  const mockTama3 = {
    battleWins: 10,
    battleCount: 15,
    escapeCount: 1,
    courageGaugeCount: 0,
    bathRefuseCount: 0,
    bathEscapeCount: 0,
    stats: {
      happiness: 50,
      hunger: 50,
      cleanliness: 50,
      courage: 10,
    },
    unlockedTitles: [],
    representativeTitle: null,
  } as unknown as ITamagotchi;

  checkAndUnlockTitles(mockTama3);
  assert(mockTama3.unlockedTitles.includes('🥊 싸움 좀 하는 놈'), 'Unlocks fighter title on 10 wins');
  assert(mockTama3.unlockedTitles.includes('😭 겁쟁이'), 'Unlocks coward title on first escape');
  assert(mockTama3.representativeTitle === '🥊 싸움 좀 하는 놈', 'Auto-sets representative title');

  console.log('--- ALL TAMAGOTCHI UNIT TESTS PASSED ---');
};

runTests();
