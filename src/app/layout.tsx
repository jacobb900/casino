import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pl">
        <body>
        <nav style={{ padding: 20, background: "#111", color: "#fff" }}>
            <Link href="/">🎰 Casino</Link>{" | "}
            <Link href="/slots">Automaty</Link>{" | "}
            <Link href="/blackjack">Blackjack</Link>{" | "}
            <Link href="/roulette">Ruletka</Link>
        </nav>
        {children}
        </body>
        </html>
    );
}
