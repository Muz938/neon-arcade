"use client";
import { useEffect, useRef, useState } from "react";
import { useGame } from "@/lib/GameContext";
import { Trophy, ArrowLeft, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PongProps {
    mode: 'local' | 'ai' | 'online';
    onExit: () => void;
}

export default function Pong({ mode, onExit }: PongProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { updateStats } = useGame();
    const [score, setScore] = useState({ p1: 0, p2: 0 });
    const [gameState, setGameState] = useState<'playing' | 'paused' | 'ended'>('playing');
    const [winner, setWinner] = useState<string | null>(null);

    const paddleHeight = 80;
    const paddleWidth = 10;
    const ballSize = 8;
    const winScore = 5;

    useEffect(() => {
        if (gameState !== 'playing') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let ballX = canvas.width / 2;
        let ballY = canvas.height / 2;
        let ballSpeedX = 5;
        let ballSpeedY = 3;

        let paddle1Y = canvas.height / 2 - paddleHeight / 2;
        let paddle2Y = canvas.height / 2 - paddleHeight / 2;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'w' || e.key === 'W') paddle1Y -= 30;
            if (e.key === 's' || e.key === 'S') paddle1Y += 30;
            if (mode === 'local') {
                if (e.key === 'ArrowUp') paddle2Y -= 30;
                if (e.key === 'ArrowDown') paddle2Y += 30;
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseY = e.clientY - rect.top;
            paddle1Y = mouseY - paddleHeight / 2;
        };

        window.addEventListener('keydown', handleKeyDown);
        canvas.addEventListener('mousemove', handleMouseMove);

        const update = () => {
            if (gameState !== 'playing') return;

            // Ball movement
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            // Wall bounce
            if (ballY < 0 || ballY > canvas.height) ballSpeedY = -ballSpeedY;

            // Paddle 1 Collision
            if (ballX < paddleWidth) {
                if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
                    ballSpeedX = -ballSpeedX;
                    ballSpeedX *= 1.05; // Speed up
                } else {
                    setScore(prev => ({ ...prev, p2: prev.p2 + 1 }));
                    resetBall();
                }
            }

            // Paddle 2 Collision
            if (ballX > canvas.width - paddleWidth) {
                if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
                    ballSpeedX = -ballSpeedX;
                } else {
                    setScore(prev => ({ ...prev, p1: prev.p1 + 1 }));
                    resetBall();
                }
            }

            // AI Logic
            if (mode === 'ai') {
                const targetY = ballY - paddleHeight / 2;
                paddle2Y += (targetY - paddle2Y) * 0.1;
            }

            // Clamp paddles
            paddle1Y = Math.max(0, Math.min(canvas.height - paddleHeight, paddle1Y));
            paddle2Y = Math.max(0, Math.min(canvas.height - paddleHeight, paddle2Y));

            draw();
            requestAnimationFrame(update);
        };

        const resetBall = () => {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = -ballSpeedX;
            ballSpeedX = ballSpeedX > 0 ? 5 : -5;
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background grid
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            }
            for (let i = 0; i < canvas.height; i += 40) {
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
            }

            // Center Line
            ctx.setLineDash([10, 10]);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath(); ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height); ctx.stroke();
            ctx.setLineDash([]);

            // Paddles
            ctx.fillStyle = '#00f3ff';
            ctx.shadowBlur = 15; ctx.shadowColor = '#00f3ff';
            ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);

            ctx.fillStyle = '#ff00ff';
            ctx.shadowBlur = 15; ctx.shadowColor = '#ff00ff';
            ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

            // Ball
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 10; ctx.shadowColor = '#fff';
            ctx.beginPath();
            ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        };

        update();

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [gameState, mode]);

    useEffect(() => {
        if (score.p1 >= winScore) {
            setGameState('ended');
            setWinner('PLAYER 1');
            updateStats({ xp: 100, coins: 20, win: true });
        } else if (score.p2 >= winScore) {
            setGameState('ended');
            setWinner(mode === 'ai' ? 'CYBER AI' : 'PLAYER 2');
            updateStats({ xp: 20, win: false });
        }
    }, [score, mode, updateStats]);

    return (
        <div className="flex flex-col items-center justify-center gap-8 w-full max-w-4xl">
            <div className="flex justify-between w-full px-8 text-4xl font-display italic font-black">
                <span className="text-cyan-500">{score.p1}</span>
                <span className="text-zinc-700">VS</span>
                <span className="text-purple-500">{score.p2}</span>
            </div>

            <div className="relative glass-panel p-2 border-zinc-800">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={450}
                    className="bg-black rounded-xl cursor-none w-full max-w-[90vw] h-auto aspect-video"
                />

                <AnimatePresence>
                    {gameState === 'ended' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl rounded-xl z-20 space-y-6"
                        >
                            <Trophy className="w-16 h-16 text-yellow-500 animate-bounce" />
                            <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">{winner} VICTORIOUS</h2>
                            <div className="text-zinc-500 font-mono text-xs tracking-[0.4em]">+100 XP SYNCED</div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setScore({ p1: 0, p2: 0 });
                                        setGameState('playing');
                                        setWinner(null);
                                    }}
                                    className="bg-white text-black font-black px-8 py-3 rounded-2xl flex items-center gap-2 hover:scale-105 transition-all"
                                >
                                    <RotateCcw className="w-5 h-5" /> REBOOT
                                </button>
                                <button
                                    onClick={onExit}
                                    className="bg-zinc-900 border border-zinc-800 text-white font-black px-8 py-3 rounded-2xl hover:bg-zinc-800 transition-all"
                                >
                                    EXIT HUB
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="text-[10px] font-black text-zinc-600 tracking-[0.2em] uppercase">
                {mode === 'ai' ? 'Use mouse or W/S to move' : 'W/S for P1 • Arrows for P2'}
            </div>
        </div>
    );
}
