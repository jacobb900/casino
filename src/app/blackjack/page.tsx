"use client";
import { useMemo, useState } from "react";

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

    const addBet = (v: number) => {
        if (!playing && bank >= v) {
            setBet(b => b + v);
            setBank(b => b - v);
        }
    };

    const deal = () => {
        if (bet === 0) return;
        setPlayer([draw(), draw()]);
        setDealer([draw(), draw()]);
        setPlaying(true);
        setMsg("");
    };

    const hit = () => {
        const h = [...player, draw()];
        setPlayer(h);
        if (count(h) > 21) {
            setMsg("💥 BUST – PRZEGRANA");
            setPlaying(false);
            setBet(0);
        }
    };

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

    const playerSum = useMemo(() => count(player), [player]);
    const dealerSum = useMemo(() => count(dealer), [dealer]);

    return (
        <div className="blackjackPage">
            <div className="blackjackTop">
                <div className="bank">💰 Bank: {bank} zł</div>

                <div className="betRow">
                    <div className="betLabel">💵 Stawka: {bet} zł</div>
                    <input
                        className="betInput"
                        type="number"
                        min={1}
                        max={1000}
                        value={bet}
                        onChange={(e) => {
                            const v = Number(e.target.value);
                            if (!playing && v >= 0 && v <= bank + bet) {
                                // zwróć kasę jeśli zmniejsza stawkę
                                const diff = v - bet;
                                setBet(v);
                                setBank(b => b - diff);
                            }
                        }}
                        placeholder="0"
                    />
                </div>

                {!playing && (
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
                )}
            </div>

            <div className="table">
                <div className="hand">
                    <h3>🤵 Krupier</h3>
                    <div className="cards">
                        {dealer.map((c, i) => (
                            <div key={i} className="card">
                                {playing && i === 0 ? "🂠" : c.n}
                            </div>
                        ))}
                    </div>
                    <div className="sum">{playing ? "??" : dealerSum}</div>
                </div>

                <div className="hand">
                    <h3>🙂 Ty</h3>
                    <div className="cards">
                        {player.map((c, i) => (
                            <div key={i} className="card">
                                {c.n}
                            </div>
                        ))}
                    </div>
                    <div className="sum">{playerSum}</div>
                </div>
            </div>

            <div className="controls">
                {playing ? (
                    <>
                        <button className="btn" onClick={hit}>HIT</button>
                        <button className="btn" onClick={stand}>STAND</button>
                    </>
                ) : (
                    <button className="btn dealBtn" onClick={deal}>DEAL</button>
                )}
            </div>

            <div className="msg">{msg}</div>
        </div>
    );
}
