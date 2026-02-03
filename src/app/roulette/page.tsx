"use client";
import { useEffect, useState } from "react";

const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30,
    8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7,
    28, 12, 35, 3, 26,
];

const getColorName = (n: number): "red" | "black" | "green" =>
    n === 0 ? "green" : n % 2 === 0 ? "black" : "red";

const getColorHex = (n: number) =>
    n === 0 ? "#00b050" : n % 2 === 0 ? "#111" : "#d12b2b";

type HistoryItem = {
    number: number;
    color: "red" | "black" | "green";
};

export default function RoulettePage() {
    const [bank, setBank] = useState(1000);
    const [bet, setBet] = useState<number | "">("");
    const [choice, setChoice] = useState<"red" | "black" | "green" | null>(null);

    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [ballAngle, setBallAngle] = useState(0);

    const [message, setMessage] = useState("");
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // useEffect do animacji kulki
    useEffect(() => {
        if (!spinning) return;

        const duration = 3300;
        const start = performance.now();
        const endAngle = rotation + 720 + Math.random() * 360;

        const frame = (time: number) => {
            const t = Math.min((time - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setBallAngle(endAngle * eased);

            if (t < 1) requestAnimationFrame(frame);
        };

        requestAnimationFrame(frame);
    }, [spinning, rotation]);

    const spin = () => {
        if (!choice) {
            setMessage("❌ Wybierz na co grasz");
            return;
        }
        if (bet === "" || bet < 1 || bet > 1000) {
            setMessage("❌ Stawka 1–1000");
            return;
        }
        if (bank < bet) {
            setMessage("❌ Brak kasy");
            return;
        }

        setBank((b) => b - bet);
        setMessage("🎡 Kręcimy...");
        setSpinning(true);

        const spins = 6 + Math.random() * 4;
        const angle = spins * 360 + Math.random() * 360;
        setRotation(angle);

        const winNumber = numbers[Math.floor(Math.random() * numbers.length)];

        setTimeout(() => {
            setSpinning(false);

            const color = getColorName(winNumber);

            setHistory((h) => {
                const arr = [{ number: winNumber, color }, ...h];
                return arr.slice(0, 10);
            });

            if (choice === "green" && winNumber === 0) {
                setBank((b) => b + bet * 14);
                setMessage("🎉 JACKPOT! Wypadło 0");
            } else if (choice === color) {
                setBank((b) => b + bet * 2);
                setMessage(`🎉 WYGRAŁEŚ! Wypadło ${winNumber} (${color})`);
            } else {
                setMessage(`😢 Przegrałeś — ${winNumber} (${color})`);
            }
        }, 3300);
    };

    const ballPosition = (() => {
        const radius = 210;
        const rad = ((ballAngle % 360) * Math.PI) / 180;
        return {
            x: 250 + radius * Math.cos(rad),
            y: 250 + radius * Math.sin(rad),
        };
    })();

    return (
        <main className="roulettePage">
            <div className="rouletteTop">
                <div className="bank">💰 Bank: {bank} zł</div>

                <div className="betBox">
                    <div className="betLabel">🎯 Stawka:</div>
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
                            if (!/^\d+$/.test(v)) return;
                            setBet(Number(v));
                        }}
                    />
                </div>

                <div className="choices">
                    <button
                        className={`choice red ${choice === "red" ? "active" : ""}`}
                        onClick={() => setChoice("red")}
                    >
                        CZERWONE
                    </button>
                    <button
                        className={`choice black ${choice === "black" ? "active" : ""}`}
                        onClick={() => setChoice("black")}
                    >
                        CZARNE
                    </button>
                    <button
                        className={`choice green ${choice === "green" ? "active" : ""}`}
                        onClick={() => setChoice("green")}
                    >
                        0
                    </button>
                </div>

                <button className="spinBtn" onClick={spin} disabled={spinning}>
                    {spinning ? "KRĘCIMY..." : "SPIN"}
                </button>

                <div className="msg">{message}</div>

                <div className="history">
                    <h4>Historia (ostatnie 10)</h4>
                    <div className="historyList">
                        {history.length === 0 ? (
                            <div className="historyEmpty">Brak wyników</div>
                        ) : (
                            history.map((h, idx) => (
                                <div key={idx} className={`historyItem ${h.color}`}>
                                    {h.number}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="rouletteArea">
                <div className="wheelWrap">
                    <svg
                        className="wheelSvg"
                        viewBox="0 0 500 500"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            transition: spinning
                                ? "transform 3.3s cubic-bezier(0.25, 0.1, 0.25, 1)"
                                : "none",
                        }}
                    >
                        <defs>
                            <radialGradient id="rim" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#cfa46e" />
                                <stop offset="100%" stopColor="#8b5a2f" />
                            </radialGradient>
                        </defs>

                        <circle cx="250" cy="250" r="240" fill="url(#rim)" />

                        <g>
                            {numbers.map((n, i) => {
                                const start = (i * 360) / numbers.length;
                                const end = ((i + 1) * 360) / numbers.length;
                                const hex = getColorHex(n);

                                const x1 = 250 + 200 * Math.cos((start * Math.PI) / 180);
                                const y1 = 250 + 200 * Math.sin((start * Math.PI) / 180);
                                const x2 = 250 + 200 * Math.cos((end * Math.PI) / 180);
                                const y2 = 250 + 200 * Math.sin((end * Math.PI) / 180);

                                const largeArc = end - start > 180 ? 1 : 0;

                                const path = `
                  M 250 250
                  L ${x1} ${y1}
                  A 200 200 0 ${largeArc} 1 ${x2} ${y2}
                  Z
                `;

                                const midAngle = (start + end) / 2;
                                const tx = 250 + 150 * Math.cos((midAngle * Math.PI) / 180);
                                const ty = 250 + 150 * Math.sin((midAngle * Math.PI) / 180);

                                return (
                                    <g key={i}>
                                        <path d={path} fill={hex} stroke="#fff" strokeWidth="2" />
                                        <text
                                            x={tx}
                                            y={ty}
                                            fill="#fff"
                                            fontSize="18"
                                            fontWeight="700"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            {n}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>
                    </svg>

                    <div className="pointer" />

                    <div
                        className="ball"
                        style={{ left: `${ballPosition.x}px`, top: `${ballPosition.y}px` }}
                    />
                </div>
            </div>
        </main>
    );
}
