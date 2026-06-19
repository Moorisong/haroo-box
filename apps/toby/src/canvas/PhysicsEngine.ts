import { Ball } from './Ball';
import { Obstacle, GameMode } from './types';
import { MapGenerator } from './MapGenerator';
import { CollisionResolver } from './CollisionResolver';
import { PhysicsRenderer } from './PhysicsRenderer';

export class PhysicsEngine {
    balls: Ball[] = [];
    obstacles: Obstacle[] = [];
    mode: GameMode = 1;

    gravity: number = 0.5;
    friction: number = 0.99;
    restitution: number = 0.55;

    width: number = 800;
    height: number = 600;
    worldHeight: number = 9000;
    cameraY: number = 0;
    frameCount: number = 0;

    constructor(width: number, height: number, mode: GameMode = 1) {
        this.width = width;
        this.height = height;
        this.mode = mode;
        this.initMaze();
    }

    setMode(mode: GameMode) {
        this.mode = mode;
        this.initMaze();
    }

    addBall(ball: Ball) {
        ball.radius = 18;
        this.balls.push(ball);
    }

    clear() {
        this.balls = [];
        this.cameraY = 0;
        this.frameCount = 0;
    }

    initMaze() {
        if (this.mode === 1) {
            this.obstacles = MapGenerator.initFixedMaze(this.width, this.height, this.worldHeight);
        } else {
            this.obstacles = MapGenerator.initRandomMaze(this.width, this.height, this.worldHeight);
        }
    }

    update() {
        this.frameCount++;
        let maxY = 0;

        for (const obs of this.obstacles) {
            if (obs.type === 'rotator') obs.angle += obs.speed;
            if (obs.type === 'gear') obs.angle += obs.speed;
            if (obs.type === 'spring' && obs.compressed > 0) obs.compressed -= 0.1;
        }

        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];

            ball.vy += this.gravity;
            ball.vx *= this.friction;
            ball.vy *= this.friction;
            ball.update();

            for (const obs of this.obstacles) {
                if (obs.type === 'circle') CollisionResolver.resolveCircleCollision(ball, obs, this.restitution);
                if (obs.type === 'line') CollisionResolver.resolveLineCollision(ball, obs, this.restitution);
                if (obs.type === 'rotator') CollisionResolver.resolveRotatorCollision(ball, obs, this.restitution);
                if (obs.type === 'launcher') CollisionResolver.resolveLauncherCollision(ball, obs);
                if (obs.type === 'trap') CollisionResolver.resolveTrapCollision(ball, obs, this.width);
                if (obs.type === 'hole') CollisionResolver.resolveHoleCollision(ball, obs);
                if (obs.type === 'gear') CollisionResolver.resolveGearCollision(ball, obs, this.restitution);
                if (obs.type === 'bumper') CollisionResolver.resolveBumperCollision(ball, obs);
                if (obs.type === 'spring') CollisionResolver.resolveSpringCollision(ball, obs);
                if (obs.type === 'vibrator') CollisionResolver.resolveVibratorCollision(ball, obs, this.frameCount);
                if (obs.type === 'wind') CollisionResolver.resolveWindCollision(ball, obs);
                if (obs.type === 'boostZone') CollisionResolver.resolveBoostZoneCollision(ball, obs);
                if (obs.type === 'spinZone') CollisionResolver.resolveSpinZoneCollision(ball, obs);
                if (obs.type === 'portal') CollisionResolver.resolvePortalCollision(ball, obs, this.obstacles);
            }

            if (ball.x - ball.radius < 0) { ball.x = ball.radius; ball.vx *= -this.restitution; }
            if (ball.x + ball.radius > this.width) { ball.x = this.width - ball.radius; ball.vx *= -this.restitution; }

            for (let j = i + 1; j < this.balls.length; j++) {
                CollisionResolver.resolveBallCollision(ball, this.balls[j]);
            }

            if (ball.y > maxY) maxY = ball.y;
            if (ball.y > this.worldHeight) ball.isGoals = true;
        }

        let targetCamY = maxY - this.height * 0.6;
        targetCamY = Math.max(0, Math.min(targetCamY, this.worldHeight - this.height));
        this.cameraY += (targetCamY - this.cameraY) * 0.1;
    }

    draw(ctx: CanvasRenderingContext2D) {
        PhysicsRenderer.draw(
            ctx,
            this.width,
            this.height,
            this.worldHeight,
            this.cameraY,
            this.frameCount,
            this.mode,
            this.obstacles,
            this.balls
        );
    }

    getGoalBall(): Ball | null { return this.balls.find(b => b.isGoals) || null; }
}
