"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X as XIcon, Circle, Trophy, User, RotateCcw } from "lucide-react";

type Player = 'X' | 'O';
type Board = (Player | null)[];

interface TicTacToeProps {
    mode: 'local' | 'ai' | 'online';
    onExit: () => void;
}

const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

export default function TicTacToe({ mode, onExit }: TicTacToeProps) {
    const [board, setBoard] = useState<Board>(Array(9).fill(null));
    const [currentTurn, setCurrentTurn] = useState<Player>('X');
    const [winner, setWinner] = useState<Player | 'draw' | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);

    const isMyTurn = mode === 'local' ? true : mode === 'ai' ? currentTurn === 'X' : true;

    const checkWinner = (bd: Board): { winner: Player | 'draw' | null; line: number[] | null } => {
        for (let line of WIN_LINES) {
            const [a, b, c] = line;
            if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) {
                return { winner: bd[a], line };
            }
        }
        if (bd.every(x => x)) return { winner: 'draw', line: null };
        return { winner: null, line: null };
    };

    // Minimax AI for smarter gameplay
    const minimax = (bd: Board, depth: number, isMaximizing: boolean): number => {
        const result = checkWinner(bd);
        if (result.winner === 'O') return 10 - depth;
        if (result.winner === 'X') return depth - 10;
        if (result.winner === 'draw') return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (bd[i] === null) {
                    bd[i] = 'O';
                    const score = minimax(bd, depth + 1, false);
                    bd[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (bd[i] === null) {
                    bd[i] = 'X';
                    const score = minimax(bd, depth + 1, true);
                    bd[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const getBestMove = (bd: Board): number => {
        let bestScore = -Infinity;
        let bestMove = -1;
        for (let i = 0; i < 9; i++) {
            if (bd[i] === null) {
                bd[i] = 'O';
                const score = minimax(bd, 0, false);
                bd[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    };

    const handleMove = useCallback((index: number) => {
        if (board[index] || winner || !isMyTurn) return;

        const newBoard = [...board];
        newBoard[index] = currentTurn;

        const result = checkWinner(newBoard);

        setBoard(newBoard);

        if (result.winner) {
            setWinner(result.winner);
            setWinningLine(result.line);
            return;
        }

        if (mode === 'local') {
            setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
        } else if (mode === 'ai') {
            setCurrentTurn('O');
            // AI Turn
            setTimeout(() => {
                const aiMove = getBestMove([...newBoard]);
                if (aiMove !== -1) {
                    const aiBoard = [...newBoard];
                    aiBoard[aiMove] = 'O';
                    const aiResult = checkWinner(aiBoard);
                    setBoard(aiBoard);
                    if (aiResult.winner) {
                        setWinner(aiResult.winner);
                        setWinningLine(aiResult.line);
                    } else {
                        setCurrentTurn('X');
                    }
                }
            }, 400);
        }
    }, [board, winner, isMyTurn, mode, currentTurn]);

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentTurn('X');
        setWinner(null);
        setWinningLine(null);
    };

    return (
        <div className="flex flex-col items-center justify-center gap-8 w-full h-full p-4">
            {/* Player indicators */}
            <div className="flex justify-between w-full max-w-md items-center text-xl font-display text-white">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${currentTurn === 'X' && !winner
                        ? 'text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/50 scale-105'
                        : 'opacity-50'
                    }`}>
                    <User size={24} />
                    <span>YOU</span>
                    <XIcon size={20} className="text-[var(--primary)]" />
                </div>
                <div className="text-2xl font-mono text-gray-500">VS</div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${currentTurn === 'O' && !winner
                        ? 'text-[var(--secondary)] bg-[var(--secondary)]/10 border border-[var(--secondary)]/50 scale-105'
                        : 'opacity-50'
                    }`}>
                    <Circle size={20} className="text-[var(--secondary)]" />
                    <span>{mode === 'ai' ? 'AI' : 'P2'}</span>
                    <User size={24} />
                </div>
            </div>

            <div className="relative">
                {/* Game board */}
                <div className="grid grid-cols-3 gap-2 bg-slate-800/50 p-3 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl">
                    {board.map((cell, i) => (
                        <motion.button
                            key={i}
                            whileHover={!cell && !winner ? { scale: 0.95, backgroundColor: "rgba(255,255,255,0.08)" } : {}}
                            whileTap={!cell && !winner ? { scale: 0.9 } : {}}
                            onClick={() => handleMove(i)}
                            className={`
                w-24 h-24 md:w-28 md:h-28 bg-black/40 rounded-xl flex items-center justify-center relative overflow-hidden
                ${!cell && !winner ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'}
                ${winningLine?.includes(i) ? 'bg-[var(--accent)]/20 border-2 border-[var(--accent)]' : ''}
                transition-colors duration-200
              `}
                            disabled={!!cell || !!winner}
                        >
                            <AnimatePresence>
                                {cell === 'X' && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -90 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="text-[var(--primary)]"
                                        style={{ filter: 'drop-shadow(0 0 12px rgba(0,243,255,0.8))' }}
                                    >
                                        <XIcon size={56} strokeWidth={3} />
                                    </motion.div>
                                )}
                                {cell === 'O' && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="text-[var(--secondary)]"
                                        style={{ filter: 'drop-shadow(0 0 12px rgba(255,0,255,0.8))' }}
                                    >
                                        <Circle size={56} strokeWidth={3} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    ))}
                </div>

                {/* Winner Overlay */}
                <AnimatePresence>
                    {winner && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl z-20"
                        >
                            {winner === 'draw' ? (
                                <div className="text-center">
                                    <div className="text-5xl mb-2">🤝</div>
                                    <div className="text-3xl font-display text-gray-300">DRAW</div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                    >
                                        <Trophy size={64} className="text-yellow-400 mx-auto mb-4" />
                                    </motion.div>
                                    <div className={`text-3xl font-display mb-2 ${winner === 'X' ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>
                                        {winner === 'X' ? 'YOU WIN!' : (mode === 'ai' ? 'AI WINS!' : 'P2 WINS!')}
                                    </div>
                                    <div className="text-sm text-gray-400">+50 XP • +10 Coins</div>
                                </div>
                            )}
                            <div className="flex gap-4 mt-6">
                                <button onClick={resetGame} className="btn-primary flex items-center gap-2">
                                    <RotateCcw size={18} /> Play Again
                                </button>
                                <button onClick={onExit} className="px-6 py-3 border border-white/20 rounded-lg text-gray-300 hover:bg-white/10 transition-colors">
                                    Exit
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={resetGame}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
                >
                    <RotateCcw size={18} /> Reset
                </button>
                <button
                    onClick={onExit}
                    className="text-gray-500 hover:text-white transition-colors px-4 py-2"
                >
                    Exit Game
                </button>
            </div>
        </div>
    );
}
