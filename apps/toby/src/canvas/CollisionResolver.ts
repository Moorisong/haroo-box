import { Ball } from './Ball';
import {
    ObstacleHole, ObstacleGear, ObstacleBumper, ObstacleSpring,
    ObstacleVibrator, ObstacleTrap, ObstacleWind, ObstacleBoostZone,
    ObstacleSpinZone, ObstaclePortal, ObstacleLauncher, ObstacleRotator,
    ObstacleCircle, ObstacleLine, Obstacle
} from './types';

export class CollisionResolver {
    static resolveHoleCollision(ball: Ball, hole: ObstacleHole) {
        const dx = ball.x - hole.x;
        const dy = ball.y - hole.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < hole.radius - 5) {
            ball.y = hole.teleportY;
            ball.x = hole.x + (Math.random() - 0.5) * 50;
            ball.vy = Math.abs(ball.vy) * 0.5 + 3;
            ball.vx = (Math.random() - 0.5) * 5;
        }
    }

    static resolveGearCollision(ball: Ball, gear: ObstacleGear, restitution: number) {
        const dx = ball.x - gear.x;
        const dy = ball.y - gear.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const effectiveRadius = gear.radius + 10;

        if (dist < effectiveRadius + ball.radius) {
            const ballAngle = Math.atan2(dy, dx);
            const toothAngle = (gear.teeth * (ballAngle - gear.angle)) % (Math.PI * 2);
            const toothEffect = Math.sin(toothAngle) * 0.5 + 0.5;

            const overlap = effectiveRadius + ball.radius - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            ball.x += nx * overlap;
            ball.y += ny * overlap;

            const tangentX = -ny * gear.speed * 50 * toothEffect;
            const tangentY = nx * gear.speed * 50 * toothEffect;
            ball.vx += tangentX;
            ball.vy += tangentY;

            const dot = ball.vx * nx + ball.vy * ny;
            ball.vx -= 2 * dot * nx * restitution;
            ball.vy -= 2 * dot * ny * restitution;
        }
    }

    static resolveBumperCollision(ball: Ball, bumper: ObstacleBumper) {
        const dx = ball.x - bumper.x;
        const dy = ball.y - bumper.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = ball.radius + bumper.radius;

        if (dist < minDist) {
            const angle = Math.atan2(dy, dx);
            ball.x = bumper.x + Math.cos(angle) * minDist;
            ball.y = bumper.y + Math.sin(angle) * minDist;
            ball.vx = Math.cos(angle) * bumper.force;
            ball.vy = Math.sin(angle) * bumper.force;
        }
    }

    static resolveSpringCollision(ball: Ball, spring: ObstacleSpring) {
        if (ball.x > spring.x && ball.x < spring.x + spring.width &&
            ball.y + ball.radius > spring.y && ball.y - ball.radius < spring.y + spring.height) {
            if (ball.vy > 0) {
                ball.vy = -spring.force;
                ball.y = spring.y - ball.radius - 2;
                spring.compressed = 1;
            }
        }
    }

    static resolveVibratorCollision(ball: Ball, vib: ObstacleVibrator, frameCount: number) {
        const offsetX = Math.sin(frameCount * 0.1 + vib.phase) * vib.amplitude;
        const actualX = vib.x + offsetX;

        if (ball.x > actualX && ball.x < actualX + vib.width &&
            ball.y + ball.radius > vib.y && ball.y - ball.radius < vib.y + vib.height) {
            ball.y = vib.y - ball.radius - 1;
            ball.vy *= -0.5;
            ball.vx += Math.cos(frameCount * 0.1 + vib.phase) * 2;
        }
    }

    static resolveTrapCollision(ball: Ball, trap: ObstacleTrap, width: number) {
        const dx = ball.x - trap.x;
        const dy = ball.y - trap.y;
        if (Math.sqrt(dx * dx + dy * dy) < trap.radius) {
            ball.y = trap.penaltyY;
            ball.x = width / 2 + (Math.random() - 0.5) * 100;
            ball.vy = 0; ball.vx = (Math.random() - 0.5) * 3;
        }
    }

    static resolveWindCollision(ball: Ball, wind: ObstacleWind) {
        if (ball.x > wind.x && ball.x < wind.x + wind.width &&
            ball.y > wind.y && ball.y < wind.y + wind.height) {
            ball.vx += wind.forceX;
            ball.vy += wind.forceY;
            if (ball.vy < 0.5) ball.vy = 0.5;
        }
    }

    static resolveBoostZoneCollision(ball: Ball, boost: ObstacleBoostZone) {
        if (ball.x > boost.x && ball.x < boost.x + boost.width &&
            ball.y > boost.y && ball.y < boost.y + boost.height) {
            ball.vy *= boost.boostFactor;
            ball.vx *= boost.boostFactor;
        }
    }

    static resolveSpinZoneCollision(ball: Ball, spin: ObstacleSpinZone) {
        const dx = ball.x - spin.x;
        const dy = ball.y - spin.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < spin.radius) {
            const spinForce = spin.spinSpeed * spin.spinDirection;
            const tangentX = -dy / dist * spinForce;
            const tangentY = dx / dist * spinForce;
            
            ball.vx += tangentX;
            ball.vy += tangentY;
        }
    }

    static resolvePortalCollision(ball: Ball, portal: ObstaclePortal, obstacles: Obstacle[]) {
        const dx = ball.x - portal.x;
        const dy = ball.y - portal.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < portal.radius && ball.vy > 0) {
            const targetPortal = obstacles.find(o => o.type === 'portal' && o.id === portal.targetId);
            if (targetPortal && targetPortal.type === 'portal') {
                ball.x = targetPortal.x;
                ball.y = targetPortal.y + 30;
                ball.vy = Math.max(ball.vy, 3);
                ball.vx = (Math.random() - 0.5) * 4;
            }
        }
    }

    static resolveLauncherCollision(ball: Ball, l: ObstacleLauncher) {
        if (ball.x > l.x && ball.x < l.x + l.width &&
            ball.y + ball.radius > l.y && ball.y - ball.radius < l.y + l.height) {
            ball.vy = -l.force;
            ball.y = l.y - ball.radius - 2;
        }
    }

    static resolveRotatorCollision(ball: Ball, rot: ObstacleRotator, restitution: number) {
        const dx1 = Math.cos(rot.angle) * rot.length / 2;
        const dy1 = Math.sin(rot.angle) * rot.length / 2;
        const line: ObstacleLine = { type: 'line', x1: rot.x - dx1, y1: rot.y - dy1, x2: rot.x + dx1, y2: rot.y + dy1 };
        CollisionResolver.resolveLineCollision(ball, line, restitution);
        const dist = Math.sqrt((ball.x - rot.x) ** 2 + (ball.y - rot.y) ** 2);
        if (dist < rot.length / 2 + ball.radius + 10) {
            ball.vx += -Math.sin(rot.angle) * rot.speed * 25;
            ball.vy += Math.cos(rot.angle) * rot.speed * 25;
        }
    }

    static resolveCircleCollision(ball: Ball, c: ObstacleCircle, restitution: number) {
        const dx = ball.x - c.x, dy = ball.y - c.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = ball.radius + c.radius;
        if (dist < minDist) {
            const angle = Math.atan2(dy, dx);
            ball.x += Math.cos(angle) * (minDist - dist);
            ball.y += Math.sin(angle) * (minDist - dist);
            const nx = dx / dist, ny = dy / dist;
            const dot = ball.vx * nx + ball.vy * ny;
            ball.vx -= 2 * dot * nx * restitution;
            ball.vy -= 2 * dot * ny * restitution;
        }
    }

    static resolveLineCollision(ball: Ball, line: ObstacleLine, restitution: number) {
        const dx = ball.x - line.x1, dy = ball.y - line.y1;
        const lx = line.x2 - line.x1, ly = line.y2 - line.y1;
        const lenSq = lx * lx + ly * ly;
        let t = Math.max(0, Math.min(1, (dx * lx + dy * ly) / lenSq));
        const cx = line.x1 + t * lx, cy = line.y1 + t * ly;
        const distX = ball.x - cx, distY = ball.y - cy;
        const dist = Math.sqrt(distX * distX + distY * distY);
        if (dist < ball.radius) {
            const overlap = ball.radius - dist;
            const nx = distX / dist, ny = distY / dist;
            ball.x += nx * overlap; ball.y += ny * overlap;
            const dot = ball.vx * nx + ball.vy * ny;
            ball.vx -= 2 * dot * nx * restitution;
            ball.vy -= 2 * dot * ny * restitution;
        }
    }

    static resolveBallCollision(b1: Ball, b2: Ball) {
        const dx = b2.x - b1.x, dy = b2.y - b1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < b1.radius + b2.radius) {
            const overlap = (b1.radius + b2.radius - dist) / 2;
            const ox = (dx / dist) * overlap, oy = (dy / dist) * overlap;
            b1.x -= ox; b1.y -= oy; b2.x += ox; b2.y += oy;
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle), cos = Math.cos(angle);
            const vx1 = b1.vx * cos + b1.vy * sin, vy1 = b1.vy * cos - b1.vx * sin;
            const vx2 = b2.vx * cos + b2.vy * sin, vy2 = b2.vy * cos - b2.vx * sin;
            b1.vx = vx2 * cos - vy1 * sin; b1.vy = vy1 * cos + vx2 * sin;
            b2.vx = vx1 * cos - vy2 * sin; b2.vy = vy2 * cos + vx1 * sin;
            
            const randomness = 0.8 + Math.random() * 0.2;
            b1.vx *= randomness; b1.vy *= randomness; b2.vx *= randomness; b2.vy *= randomness;
            
            b1.vx += (Math.random() - 0.5) * 2;
            b1.vy += (Math.random() - 0.5) * 1;
            b2.vx += (Math.random() - 0.5) * 2;
            b2.vy += (Math.random() - 0.5) * 1;
        }
    }
}
