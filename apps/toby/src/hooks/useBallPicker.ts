import { useState, useRef, useEffect, useCallback } from 'react';
import { PhysicsEngine } from '../canvas/PhysicsEngine';
import { Ball } from '../canvas/Ball';

export const useBallPicker = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<PhysicsEngine | null>(null);
    const requestRef = useRef<number>(0);

    const [totalBalls, setTotalBalls] = useState<number>(30);
    const [gameMode, setGameMode] = useState<1 | 2>(1);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [winner, setWinner] = useState<number | null>(null);
    const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
    const [isPaused, setIsPaused] = useState<boolean>(false);

    const frameCountRef = useRef<number>(0);
    const simulationSpeedRef = useRef<number>(1);
    const accumulatorRef = useRef<number>(0);
    const isPausedRef = useRef<boolean>(false);

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        simulationSpeedRef.current = simulationSpeed;
    }, [simulationSpeed]);

    useEffect(() => {
        if (canvasRef.current && !engineRef.current) {
            engineRef.current = new PhysicsEngine(canvasRef.current.width, canvasRef.current.height, gameMode);
        }
    }, [gameMode]);

    const handleModeChange = useCallback((mode: 1 | 2) => {
        setGameMode(mode);
        if (engineRef.current) {
            engineRef.current.setMode(mode);
        }
    }, []);

    const animate = useCallback(() => {
        if (!canvasRef.current || !engineRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const engine = engineRef.current;

        if (!isPausedRef.current) {
            frameCountRef.current++;

            const baseSpeedMultiplier = 0.6;
            accumulatorRef.current += simulationSpeedRef.current * baseSpeedMultiplier;

            let updatesThisFrame = 0;
            while (accumulatorRef.current >= 1 && updatesThisFrame < 3) {
                engine.update();
                accumulatorRef.current -= 1;
                updatesThisFrame++;
            }
        }

        engine.draw(ctx);

        if (!isPausedRef.current) {
            const goalBall = engine.getGoalBall();
            if (goalBall) {
                setWinner(goalBall.number);
                setIsPlaying(false);
                setIsPaused(false);
                cancelAnimationFrame(requestRef.current);
                return;
            }
        }

        requestRef.current = requestAnimationFrame(animate);
    }, []);

    const startSimulation = useCallback(() => {
        if (!canvasRef.current || !engineRef.current) return;
        if (totalBalls < 1) {
            alert('공의 개수는 1개 이상이어야 합니다.');
            return;
        }

        setIsPlaying(true);
        setIsPaused(false);
        setWinner(null);
        frameCountRef.current = 0;
        accumulatorRef.current = 0;
        cancelAnimationFrame(requestRef.current);

        const engine = engineRef.current;

        if (gameMode === 2) {
            engine.setMode(2);
        }

        engine.clear();

        const colors = ['#4AA8FF', '#FF6B9D', '#FFE66D', '#7CB342', '#FF8A65', '#9575CD', '#FFB74D', '#BA68C8'];

        const ballOrder = Array.from({ length: totalBalls }, (_, i) => i + 1);
        for (let i = ballOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ballOrder[i], ballOrder[j]] = [ballOrder[j], ballOrder[i]];
        }

        ballOrder.forEach((ballNumber, index) => {
            setTimeout(() => {
                if (!engineRef.current) return;

                const xOffset = (Math.random() - 0.5) * (100 + index * 5);
                const yOffset = Math.random() * 80 - 60 - (index * 8);

                const x = (engine.width / 2) + xOffset;
                const y = yOffset;
                const color = colors[ballNumber % colors.length];

                const ball = new Ball(x, y, 15, ballNumber, color);

                const speedMultiplier = 1 + (index * 0.05);
                ball.vx *= speedMultiplier;
                ball.vy *= speedMultiplier;

                engine.addBall(ball);
            }, index * 120);
        });

        animate();
    }, [totalBalls, gameMode, animate]);

    useEffect(() => {
        return () => {
            cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return {
        canvasRef, totalBalls, setTotalBalls, gameMode, handleModeChange,
        isPlaying, isPaused, setIsPaused, winner, setWinner,
        simulationSpeed, setSimulationSpeed, startSimulation
    };
};
