import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { GameProvider } from '@/lib/GameContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-primary' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
    title: 'Neon Arcade Nexus',
    description: 'The ultimate futuristic multiplayer gaming platform',
};

import { ConvexClientProvider } from './ConvexClientProvider';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${orbitron.variable}`}>
                <ConvexClientProvider>
                    <GameProvider>
                        {children}
                    </GameProvider>
                </ConvexClientProvider>
            </body>
        </html>
    );
}
