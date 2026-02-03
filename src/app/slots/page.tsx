"use client";
import { useState } from "react";

const symbols = ["🍒", "🍋", "🔔", "💎"];

export default function SlotsPage() {
    const [money, setMoney] = useState(1000);
    const [bet, setBet] = useState<number | "">("");
    const [result, setResult] = useState(["❓", "❓", "❓"]);
    const [msg, setMsg] = useState("");

    const spin = () => {
        if (bet === "" || bet < 1 || bet > 1000) {
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
        <main className="slotsPage">
            <h2>🎰 AUTOMATY</h2>

            <p className="money">💰 Saldo: {money} zł</p>

            <div className="slotsScreen">
                {result.join(" ")}
            </div>

            <div className="slotsBet">
                <p className="betLabel">🎯 Stawka:</p>
                <input
                    className="betInput"
                    type="number"
                    min={1}
                    max={1000}
                    value={bet}
                    placeholder="Wpisz stawkę"
                    onChange={(e) => {
                        const v = e.target.value;
                        if (v === "") return setBet("");
                        const num = Number(v);
                        if (num >= 1 && num <= 1000) setBet(num);
                    }}
                />
            </div>

            <button className="spinBtn" onClick={spin}>
                SPIN 🎲
            </button>

            <p className="slotsMsg">{msg}</p>
        </main>
    );
}
