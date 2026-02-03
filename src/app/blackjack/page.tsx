"use client";
import { useState } from "react";

/* ===== KARTY ===== */
const deck = [
    { n: "2", v: 2 }, { n: "3", v: 3 }, { n: "4", v: 4 }, { n: "5", v: 5 },
    { n: "6", v: 6 }, { n: "7", v: 7 }, { n: "8", v: 8 }, { n: "9", v: 9 },
    { n: "10", v: 10 }, { n: "J", v: 10 }, { n: "Q", v: 10 }, { n: "K", v: 10 },
    { n: "A", v: 11 },
];

const chips = [
    { value: 1, color: "#eee" },
    { value: 5, color: "#c0392b" },
    { value: 25, color: "#27ae60" },
    { value: 50, color: "#2980b9" },
    { value: 100, color: "#2c3e50" },
    { value: 500, color: "#8e44ad" },
];

const draw = () => deck[Math.floor(Math.random() * deck.length)];

const count = (hand: any[]) => {
    let sum = hand.reduce((a, c) => a + c.v, 0);
    let aces = hand.filter(c => c.n === "A").length;
    while (sum > 21 && aces--) sum -= 10;
    return sum;
};

export default function BlackjackPage() {
    const [bank, setBank] = useState(1000);
    const [bet, setBet] = useState(0);
    const [player, setPlayer] = useState<any[]>([]);
    const [dealer, setDealer] = useState<any[]>([]);
    const [playing, setPlaying] = useState(false);
    const [msg, setMsg] = useState("");

    /* ===== ŻETONY ===== */
    const addBet = (v: number) => {
        if (!playing && bank >= v) {
            setBet(b => b + v);
            setBank(b => b - v);
        }
    };

    /* ===== DEAL ===== */
    const deal = () => {
        if (bet === 0) return;
        setPlayer([draw(), draw()]);
        setDealer([draw(), draw()]);
        setPlaying(true);
        setMsg("");
    };

    /* ===== HIT ===== */
    const hit = () => {
        const h = [...player, draw()];
        setPlayer(h);
        if (count(h) > 21) {
            setMsg("💥 BUST – PRZEGRANA");
            setPlaying(false);
            setBet(0);
        }
    };

    /* ===== STAND ===== */
    const stand = () => {
        let d = [...dealer];
        while (count(d) < 17) d.push(draw());
        setDealer(d);

        const p = count(player);
        const dc = count(d);

        if (dc > 21 || p > dc) {
            setMsg("🎉 WYGRAŁEŚ");
            setBank(b => b + bet * 2);
        } else if (p === dc) {
            setMsg("🤝 REMIS");
            setBank(b => b + bet);
        } else {
            setMsg("😢 PRZEGRANA");
        }

        setBet(0);
        setPlaying(false);
    };

    return (
        <div className="table">
            <div className="bank">💰 Bank: ${bank}</div>

            <div className="bet">${bet}</div>

            {/* KRUPIER */}
            <h3>🤵 Krupier</h3>
            <div style={{ fontSize: 28 }}>
                {dealer.map((c, i) =>
                    playing && i === 0 ? "🂠" : c.n
                ).join(" ")}
            </div>

            {/* GRACZ */}
            <h3 style={{ marginTop: 20 }}>🙂 Ty</h3>
            <div style={{ fontSize: 28 }}>
                {player.map(c => c.n).join(" ")} ({count(player)})
            </div>

            {/* PRZYCISKI */}
            {playing ? (
                <div style={{ marginTop: 30 }}>
                    <button onClick={hit}>HIT</button>
                    <button onClick={stand} style={{ marginLeft: 20 }}>STAND</button>
                </div>
            ) : (
                <>
                    <div className="chips">
                        {chips.map(c => (
                            <div
                                key={c.value}
                                className="chip"
                                style={{ background: c.color }}
                                onClick={() => addBet(c.value)}
                            >
                                {c.value}
                            </div>
                        ))}
                    </div>

                    <button className="deal" onClick={deal}>DEAL</button>
                </>
            )}

            <p style={{ marginTop: 30, fontSize: 22 }}>{msg}</p>
        </div>
    );
}
