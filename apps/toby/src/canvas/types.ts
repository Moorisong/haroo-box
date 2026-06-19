export interface ObstacleCircle {
    type: 'circle';
    x: number;
    y: number;
    radius: number;
}

export interface ObstacleLine {
    type: 'line';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export interface ObstacleRotator {
    type: 'rotator';
    x: number;
    y: number;
    length: number;
    angle: number;
    speed: number;
}

export interface ObstacleLauncher {
    type: 'launcher';
    x: number;
    y: number;
    width: number;
    height: number;
    force: number;
}

export interface ObstacleTrap {
    type: 'trap';
    x: number;
    y: number;
    radius: number;
    penaltyY: number;
}

export interface ObstacleHole {
    type: 'hole';
    x: number;
    y: number;
    radius: number;
    teleportY: number;
}

export interface ObstacleGear {
    type: 'gear';
    x: number;
    y: number;
    radius: number;
    teeth: number;
    angle: number;
    speed: number;
}

export interface ObstacleBumper {
    type: 'bumper';
    x: number;
    y: number;
    radius: number;
    force: number;
}

export interface ObstacleSpring {
    type: 'spring';
    x: number;
    y: number;
    width: number;
    height: number;
    force: number;
    compressed: number;
}

export interface ObstacleVibrator {
    type: 'vibrator';
    x: number;
    y: number;
    width: number;
    height: number;
    amplitude: number;
    phase: number;
}

export interface ObstacleWind {
    type: 'wind';
    x: number;
    y: number;
    width: number;
    height: number;
    forceX: number;
    forceY: number;
}

export interface ObstacleBoostZone {
    type: 'boostZone';
    x: number;
    y: number;
    width: number;
    height: number;
    boostFactor: number;
}

export interface ObstacleSpinZone {
    type: 'spinZone';
    x: number;
    y: number;
    radius: number;
    spinSpeed: number;
    spinDirection: 1 | -1;
}

export interface ObstaclePortal {
    type: 'portal';
    id: number;
    x: number;
    y: number;
    radius: number;
    targetId: number;
}

export type Obstacle = ObstacleCircle | ObstacleLine | ObstacleRotator | ObstacleLauncher | ObstacleTrap | ObstacleHole | ObstacleGear | ObstacleBumper | ObstacleSpring | ObstacleVibrator | ObstacleWind | ObstacleBoostZone | ObstacleSpinZone | ObstaclePortal;

export type GameMode = 1 | 2; // 1: 고정, 2: 랜덤
