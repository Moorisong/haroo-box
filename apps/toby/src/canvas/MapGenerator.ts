import { Obstacle, ObstacleLine } from './types';

export class MapGenerator {
    static addWallBumpers(obstacles: Obstacle[], width: number, startY: number, endY: number, spacing: number) {
        let count = 0;
        for (let y = startY; y < endY; y += spacing) {
            count++;
            if (count % 2 === 0) continue;
            obstacles.push({ type: 'bumper', x: 25, y: y, radius: 15, force: 10 });
            obstacles.push({ type: 'bumper', x: width - 25, y: y, radius: 15, force: 10 });
        }
    }

    static addStaticLine(obstacles: Obstacle[], x1: number, y1: number, x2: number, y2: number) {
        obstacles.push({ type: 'line', x1, y1, x2, y2 });
    }

    static generateSlideSection(obstacles: Obstacle[], width: number, cy: number): number {
        const slideCount = 2 + Math.floor(Math.random() * 2);

        for (let i = 0; i < slideCount; i++) {
            const length = 40 + Math.random() * 30;
            if (i % 2 === 0) {
                const startX = width * (0.1 + Math.random() * 0.1);
                const endX = width * (0.45 + Math.random() * 0.15);
                this.addStaticLine(obstacles, startX, cy, endX, cy + length);
            } else {
                const startX = width * (0.8 + Math.random() * 0.1);
                const endX = width * (0.4 + Math.random() * 0.15);
                this.addStaticLine(obstacles, startX, cy, endX, cy + length);
            }

            if (Math.random() < 0.3) {
                obstacles.push({ type: 'hole', x: width * (0.3 + Math.random() * 0.4), y: cy + length / 2, radius: 18, teleportY: cy + 150 });
            }

            cy += length + 40;
        }

        return cy;
    }

    static generateGearSection(obstacles: Obstacle[], width: number, cy: number): number {
        const gearCount = 1 + Math.floor(Math.random() * 2);

        for (let i = 0; i < gearCount; i++) {
            const positions = [width * 0.3, width * 0.5, width * 0.7];
            const usedPos: number[] = [];

            const numGears = 1 + Math.floor(Math.random() * 2);
            for (let g = 0; g < numGears; g++) {
                const availPos = positions.filter(p => !usedPos.includes(p));
                if (availPos.length > 0) {
                    const pos = availPos[Math.floor(Math.random() * availPos.length)];
                    usedPos.push(pos);
                    const dir = Math.random() > 0.5 ? 1 : -1;
                    obstacles.push({ type: 'gear', x: pos, y: cy, radius: 35 + Math.random() * 10, teeth: 8, angle: Math.random() * Math.PI, speed: 0.03 * dir + Math.random() * 0.02 });
                }
            }
            cy += 120;
        }

        this.addStaticLine(obstacles, width * 0.1, cy, width * 0.5, cy + 50);
        cy += 90;

        return cy;
    }

    static generateBumperSection(obstacles: Obstacle[], width: number, cy: number): number {
        const rows = 1 + Math.floor(Math.random() * 2);

        for (let r = 0; r < rows; r++) {
            const bumperCount = 2 + Math.floor(Math.random() * 3);
            for (let b = 0; b < bumperCount; b++) {
                const x = width * (0.15 + b * (0.7 / bumperCount) + Math.random() * 0.1);
                obstacles.push({ type: 'bumper', x, y: cy, radius: 16 + Math.random() * 6, force: 8 + Math.random() * 4 });
            }
            cy += 80;
        }

        this.addStaticLine(obstacles, width * 0.15, cy, width * 0.55, cy + 50);
        cy += 90;

        return cy;
    }

    static generateRotatorSection(obstacles: Obstacle[], width: number, cy: number): number {
        const rotCount = 1 + Math.floor(Math.random() * 2);

        for (let i = 0; i < rotCount; i++) {
            const dir = i % 2 === 0 ? 1 : -1;
            const length = width * (0.4 + Math.random() * 0.2);
            obstacles.push({ type: 'rotator', x: width * 0.5, y: cy, length, angle: Math.random() * Math.PI, speed: 0.04 * dir + Math.random() * 0.02 });
            cy += 110;
        }

        this.addStaticLine(obstacles, width * 0.1, cy, width * 0.5, cy + 50);
        cy += 90;

        return cy;
    }

    static generateSpringSection(obstacles: Obstacle[], width: number, cy: number): number {
        const springCount = 2 + Math.floor(Math.random() * 2);

        for (let s = 0; s < springCount; s++) {
            const x = width * (0.15 + s * (0.6 / springCount));
            obstacles.push({ type: 'spring', x, y: cy, width: 60 + Math.random() * 20, height: 12, force: 12 + Math.random() * 4, compressed: 0 });
        }
        cy += 120;

        this.addStaticLine(obstacles, width * 0.85, cy, width * 0.5, cy + 50);
        cy += 90;

        return cy;
    }

    static generateDeflectorSection(obstacles: Obstacle[], width: number, cy: number): number {
        const cols = 3 + Math.floor(Math.random() * 2);

        for (let c = 0; c < cols; c++) {
            const px = width * (0.15 + c * (0.7 / cols));
            const size = 12 + Math.random() * 4;
            this.addStaticLine(obstacles, px - size, cy + size, px, cy - size);
            this.addStaticLine(obstacles, px, cy - size, px + size, cy + size);
        }
        cy += 80;

        this.addStaticLine(obstacles, width * 0.1, cy, width * 0.55, cy + 50);
        cy += 90;

        return cy;
    }

    static generateMixedSection(obstacles: Obstacle[], width: number, cy: number): number {
        if (Math.random() > 0.5) {
            obstacles.push({ type: 'gear', x: width * 0.35, y: cy, radius: 35, teeth: 8, angle: 0, speed: 0.035 });
            obstacles.push({ type: 'bumper', x: width * 0.65, y: cy, radius: 18, force: 9 });
        } else {
            obstacles.push({ type: 'bumper', x: width * 0.35, y: cy, radius: 18, force: 9 });
            obstacles.push({ type: 'gear', x: width * 0.65, y: cy, radius: 35, teeth: 8, angle: 0, speed: -0.035 });
        }
        cy += 110;

        if (Math.random() > 0.5) {
            obstacles.push({ type: 'rotator', x: width * 0.5, y: cy, length: width * 0.45, angle: 0, speed: 0.04 });
            cy += 100;
        } else {
            obstacles.push({ type: 'spring', x: width * 0.3, y: cy, width: 70, height: 12, force: 13, compressed: 0 });
            obstacles.push({ type: 'spring', x: width * 0.55, y: cy, width: 70, height: 12, force: 13, compressed: 0 });
            cy += 110;
        }

        this.addStaticLine(obstacles, width * 0.15, cy, width * 0.5, cy + 50);
        cy += 90;

        return cy;
    }

    static generatePortalSection(obstacles: Obstacle[], width: number, cy: number): number {
        const portalId = Math.floor(Math.random() * 1000);
        
        const portal1X = width * (0.2 + Math.random() * 0.2);
        const portal2X = width * (0.6 + Math.random() * 0.2);
        
        obstacles.push({ type: 'portal', id: portalId, x: portal1X, y: cy, radius: 25, targetId: portalId + 1 });
        cy += 150;
        obstacles.push({ type: 'portal', id: portalId + 1, x: portal2X, y: cy, radius: 25, targetId: portalId });
        
        cy += 100;

        this.addStaticLine(obstacles, width * 0.15, cy, width * 0.5, cy + 50);
        cy += 90;

        return cy;
    }

    static generateBoostSection(obstacles: Obstacle[], width: number, cy: number): number {
        obstacles.push({ type: 'boostZone', x: width * 0.1, y: cy, width: width * 0.8, height: 60, boostFactor: 1.4 });
        cy += 100;

        obstacles.push({ type: 'spinZone', x: width * 0.35, y: cy, radius: 40, spinSpeed: 0.08, spinDirection: 1 });
        obstacles.push({ type: 'spinZone', x: width * 0.65, y: cy, radius: 40, spinSpeed: 0.08, spinDirection: -1 });
        cy += 100;

        this.addStaticLine(obstacles, width * 0.15, cy, width * 0.5, cy + 50);
        cy += 90;

        return cy;
    }

    static initRandomMaze(width: number, height: number, worldHeight: number): Obstacle[] {
        const obstacles: Obstacle[] = [];
        
        this.addStaticLine(obstacles, 0, 0, width * 0.4, 120);
        this.addStaticLine(obstacles, width, 0, width * 0.6, 120);

        let cy = 170;
        const sectionTypes = ['slide', 'gear', 'bumper', 'rotator', 'spring', 'deflector', 'mixed', 'portal', 'boost'];

        for (let section = 0; section < 10; section++) {
            const sectionType = sectionTypes[Math.floor(Math.random() * sectionTypes.length)];

            switch (sectionType) {
                case 'slide': cy = this.generateSlideSection(obstacles, width, cy); break;
                case 'gear': cy = this.generateGearSection(obstacles, width, cy); break;
                case 'bumper': cy = this.generateBumperSection(obstacles, width, cy); break;
                case 'rotator': cy = this.generateRotatorSection(obstacles, width, cy); break;
                case 'spring': cy = this.generateSpringSection(obstacles, width, cy); break;
                case 'deflector': cy = this.generateDeflectorSection(obstacles, width, cy); break;
                case 'mixed': cy = this.generateMixedSection(obstacles, width, cy); break;
                case 'portal': cy = this.generatePortalSection(obstacles, width, cy); break;
                case 'boost': cy = this.generateBoostSection(obstacles, width, cy); break;
            }

            if (Math.random() < 0.5) {
                this.addWallBumpers(obstacles, width, cy - 200, cy, 150);
            }

            if (section < 9 && section % 3 === 2) {
                this.addStaticLine(obstacles, 0, cy, width * 0.42, cy + 80);
                this.addStaticLine(obstacles, width, cy, width * 0.58, cy + 80);
                cy += 120;
            }
        }

        this.addStaticLine(obstacles, 0, cy, width / 2 - 45, cy + 250);
        this.addStaticLine(obstacles, width, cy, width / 2 + 45, cy + 250);
        obstacles.push({ type: 'rotator', x: width * 0.5, y: cy + 120, length: width * 0.22, angle: 0, speed: 0.05 });
        cy += 300;

        const pipeX = width / 2;
        const pipeLen = 280;
        const gap = 42;
        this.addStaticLine(obstacles, pipeX - gap, cy, pipeX - gap, cy + pipeLen);
        this.addStaticLine(obstacles, pipeX + gap, cy, pipeX + gap, cy + pipeLen);

        this.addStaticLine(obstacles, 0, 0, 0, worldHeight);
        this.addStaticLine(obstacles, width, 0, width, worldHeight);

        return obstacles;
    }

    static initFixedMaze(width: number, height: number, worldHeight: number): Obstacle[] {
        const obstacles: Obstacle[] = [];
        const W = width;

        this.addStaticLine(obstacles, 0, 0, W * 0.4, 120);
        this.addStaticLine(obstacles, W, 0, W * 0.6, 120);

        let cy = 170;

        this.addStaticLine(obstacles, W * 0.1, cy, W * 0.55, cy + 60);
        cy += 100;
        this.addStaticLine(obstacles, W * 0.9, cy, W * 0.45, cy + 60);
        obstacles.push({ type: 'bumper', x: W * 0.7, y: cy + 30, radius: 18, force: 9 });
        cy += 100;
        this.addStaticLine(obstacles, W * 0.1, cy, W * 0.7, cy + 80);
        obstacles.push({ type: 'hole', x: W * 0.4, y: cy + 40, radius: 20, teleportY: cy + 200 });
        cy += 120;
        this.addStaticLine(obstacles, W * 0.9, cy, W * 0.3, cy + 80);
        cy += 120;

        this.addWallBumpers(obstacles, W, 170, cy, 120);

        this.addStaticLine(obstacles, 0, cy, W * 0.42, cy + 120);
        this.addStaticLine(obstacles, W, cy, W * 0.58, cy + 120);
        cy += 170;

        obstacles.push({ type: 'gear', x: W * 0.35, y: cy, radius: 38, teeth: 8, angle: 0, speed: 0.035 });
        obstacles.push({ type: 'gear', x: W * 0.65, y: cy, radius: 38, teeth: 8, angle: Math.PI / 4, speed: -0.035 });
        cy += 130;

        this.addStaticLine(obstacles, W * 0.15, cy, W * 0.5, cy + 50);
        obstacles.push({ type: 'bumper', x: W * 0.35, y: cy + 25, radius: 16, force: 8 });
        cy += 90;
        this.addStaticLine(obstacles, W * 0.85, cy, W * 0.5, cy + 50);
        cy += 90;

        obstacles.push({ type: 'gear', x: W * 0.5, y: cy, radius: 42, teeth: 10, angle: 0, speed: 0.04 });
        cy += 130;

        obstacles.push({ type: 'bumper', x: W * 0.25, y: cy, radius: 20, force: 10 });
        obstacles.push({ type: 'bumper', x: W * 0.5, y: cy, radius: 20, force: 10 });
        obstacles.push({ type: 'bumper', x: W * 0.75, y: cy, radius: 20, force: 10 });
        cy += 100;

        obstacles.push({ type: 'spring', x: W * 0.2, y: cy, width: 70, height: 14, force: 14, compressed: 0 });
        obstacles.push({ type: 'spring', x: W * 0.55, y: cy, width: 70, height: 14, force: 14, compressed: 0 });
        cy += 130;

        this.addStaticLine(obstacles, W * 0.05, cy, W * 0.6, cy + 70);
        cy += 110;
        this.addStaticLine(obstacles, W * 0.95, cy, W * 0.4, cy + 70);
        cy += 110;

        this.addWallBumpers(obstacles, W, cy - 350, cy, 150);

        obstacles.push({ type: 'rotator', x: W * 0.5, y: cy, length: W * 0.55, angle: 0, speed: 0.04 });
        cy += 130;
        obstacles.push({ type: 'rotator', x: W * 0.5, y: cy, length: W * 0.55, angle: Math.PI / 3, speed: -0.04 });
        cy += 130;

        this.addStaticLine(obstacles, W * 0.1, cy, W * 0.5, cy + 55);
        cy += 90;
        this.addStaticLine(obstacles, W * 0.9, cy, W * 0.5, cy + 55);
        cy += 100;

        for (let c = 0; c < 4; c++) {
            const px = W * 0.2 + c * W * 0.2;
            const size = 14;
            this.addStaticLine(obstacles, px - size, cy + size, px, cy - size);
            this.addStaticLine(obstacles, px, cy - size, px + size, cy + size);
        }
        cy += 90;

        obstacles.push({ type: 'bumper', x: W * 0.3, y: cy, radius: 18, force: 9 });
        obstacles.push({ type: 'bumper', x: W * 0.7, y: cy, radius: 18, force: 9 });
        cy += 100;

        this.addStaticLine(obstacles, W * 0.08, cy, W * 0.6, cy + 70);
        obstacles.push({ type: 'hole', x: W * 0.35, y: cy + 35, radius: 18, teleportY: cy + 180 });
        cy += 110;
        this.addStaticLine(obstacles, W * 0.92, cy, W * 0.4, cy + 70);
        cy += 120;

        this.addStaticLine(obstacles, 0, cy, W * 0.4, cy + 140);
        this.addStaticLine(obstacles, W, cy, W * 0.6, cy + 140);
        cy += 190;

        obstacles.push({ type: 'vibrator', x: W * 0.25, y: cy, width: W * 0.5, height: 12, amplitude: 22, phase: 0 });
        cy += 120;

        obstacles.push({ type: 'gear', x: W * 0.3, y: cy, radius: 35, teeth: 8, angle: 0, speed: 0.04 });
        obstacles.push({ type: 'gear', x: W * 0.7, y: cy, radius: 35, teeth: 8, angle: 0, speed: -0.04 });
        cy += 120;

        this.addStaticLine(obstacles, W * 0.1, cy, W * 0.55, cy + 55);
        cy += 90;
        this.addStaticLine(obstacles, W * 0.9, cy, W * 0.45, cy + 55);
        obstacles.push({ type: 'bumper', x: W * 0.65, y: cy + 28, radius: 16, force: 8 });
        cy += 100;

        this.addWallBumpers(obstacles, W, cy - 400, cy, 140);

        obstacles.push({ type: 'spring', x: W * 0.15, y: cy, width: 65, height: 12, force: 13, compressed: 0 });
        obstacles.push({ type: 'spring', x: W * 0.42, y: cy, width: 65, height: 12, force: 13, compressed: 0 });
        obstacles.push({ type: 'spring', x: W * 0.7, y: cy, width: 65, height: 12, force: 13, compressed: 0 });
        cy += 130;

        obstacles.push({ type: 'rotator', x: W * 0.5, y: cy, length: W * 0.5, angle: 0, speed: 0.045 });
        cy += 120;

        this.addStaticLine(obstacles, W * 0.15, cy, W * 0.5, cy + 50);
        cy += 85;
        this.addStaticLine(obstacles, W * 0.85, cy, W * 0.5, cy + 50);
        cy += 90;

        obstacles.push({ type: 'bumper', x: W * 0.2, y: cy, radius: 18, force: 9 });
        obstacles.push({ type: 'bumper', x: W * 0.4, y: cy, radius: 18, force: 9 });
        obstacles.push({ type: 'bumper', x: W * 0.6, y: cy, radius: 18, force: 9 });
        obstacles.push({ type: 'bumper', x: W * 0.8, y: cy, radius: 18, force: 9 });
        cy += 90;

        obstacles.push({ type: 'bumper', x: W * 0.3, y: cy, radius: 18, force: 9 });
        obstacles.push({ type: 'bumper', x: W * 0.5, y: cy, radius: 18, force: 9 });
        obstacles.push({ type: 'bumper', x: W * 0.7, y: cy, radius: 18, force: 9 });
        cy += 100;

        this.addStaticLine(obstacles, W * 0.1, cy, W * 0.55, cy + 55);
        cy += 90;
        this.addStaticLine(obstacles, W * 0.9, cy, W * 0.45, cy + 55);
        cy += 100;

        obstacles.push({ type: 'gear', x: W * 0.5, y: cy, radius: 40, teeth: 10, angle: 0, speed: 0.045 });
        cy += 120;

        obstacles.push({ type: 'rotator', x: W * 0.5, y: cy, length: W * 0.5, angle: Math.PI / 4, speed: -0.05 });
        cy += 110;

        for (let c = 0; c < 5; c++) {
            const px = W * 0.1 + c * W * 0.2;
            const size = 12;
            this.addStaticLine(obstacles, px - size, cy + size, px, cy - size);
            this.addStaticLine(obstacles, px, cy - size, px + size, cy + size);
        }
        cy += 80;

        obstacles.push({ type: 'bumper', x: W * 0.35, y: cy, radius: 16, force: 8 });
        obstacles.push({ type: 'bumper', x: W * 0.65, y: cy, radius: 16, force: 8 });
        cy += 90;

        this.addWallBumpers(obstacles, W, cy - 500, cy, 160);

        this.addStaticLine(obstacles, W * 0.1, cy, W * 0.55, cy + 55);
        cy += 90;
        this.addStaticLine(obstacles, W * 0.9, cy, W * 0.45, cy + 55);
        cy += 90;
        this.addStaticLine(obstacles, W * 0.1, cy, W * 0.5, cy + 50);
        cy += 85;
        this.addStaticLine(obstacles, W * 0.9, cy, W * 0.5, cy + 50);
        cy += 100;

        this.addStaticLine(obstacles, 0, cy, W / 2 - 45, cy + 300);
        this.addStaticLine(obstacles, W, cy, W / 2 + 45, cy + 300);

        obstacles.push({ type: 'rotator', x: W * 0.5, y: cy + 150, length: W * 0.25, angle: 0, speed: 0.05 });

        obstacles.push({ type: 'wind', x: W * 0.2, y: cy, width: W * 0.6, height: 350, forceX: 0, forceY: -0.25 });
        cy += 350;

        const pipeX = W / 2;
        const pipeLen = 350;
        const gap = 38;
        this.addStaticLine(obstacles, pipeX - gap, cy, pipeX - gap, cy + pipeLen);
        this.addStaticLine(obstacles, pipeX + gap, cy, pipeX + gap, cy + pipeLen);

        obstacles.push({ type: 'wind', x: pipeX - gap, y: cy, width: gap * 2, height: pipeLen, forceX: 0, forceY: -0.3 });

        this.addStaticLine(obstacles, 0, 0, 0, worldHeight);
        this.addStaticLine(obstacles, W, 0, W, worldHeight);

        return obstacles;
    }
}
