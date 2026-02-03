"use client";
import { useState } from "react";

const symbols = ["🍒", "🍋", "🔔", "💎"];

export default function SlotsPage() {
    const [money, setMoney] = useState(1000);
    const [bet, setBet] = useState(10);
    const [result, setResult] = useState(["❓", "❓", "❓"]);
    const [msg, setMsg] = useState("");

    const spin = () => {
        if (bet < 1 || bet > 1000) {
            setMsg("❌ Stawka 1–1000");
            return;
        }

        if (money < bet) {
            setMsg("❌ Brak kasy");
            return;
        }

        const r = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
        ];

        setResult(r);
        setMoney(m => m - bet);

        if (r[0] === r[1] && r[1] === r[2]) {
            const win = bet * 5;
            setMoney(m => m + win);
            setMsg(`🎉 WYGRANA +${win} zł`);
        } else {
            setMsg("😢 Przegrana");
        }
    };

    return (
        <main style={{ padding: 60, textAlign: "center" }}>
            <h2 style={{ fontSize: 40 }}>🎰 AUTOMATY</h2>

            <p style={{ fontSize: 24 }}>💰 Saldo: {money} zł</p>

            <div
                style={{
                    fontSize: 80,
                    background: "#111",
                    padding: 30,
                    borderRadius: 20,
                    boxShadow: "0 0 30px gold",
                    margin: "30px auto",
                    width: "fit-content",
                }}
            >
                {result.join(" ")}
            </div>

            <div style={{ marginTop: 30 }}>
                <p>🎯 Stawka: {bet} zł</p>

                <input
                    type="range"
                    min="1"
                    max="1000"
                    value={bet}
                    onChange={e => setBet(Number(e.target.value))}
                    style={{ width: 300 }}
                />
            </div>

            <button onClick={spin} style={{ marginTop: 30 }}>
                SPIN 🎲
            </button>

            <p style={{ marginTop: 20, fontSize: 20 }}>{msg}</p>
        </main>
    );
}
