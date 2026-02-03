"use client";
import { useMemo, useState } from "react";

const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30,
    8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7,
    28, 12, 35, 3, 26,
];

const getColor = (n: number) =>
    n === 0 ? "#00b050" : n % 2 === 0 ? "#111" : "#d12b2b";

export default function RoulettePage() {
    const [bank, setBank] = useState(1000);
    const [bet, setBet] = useState(50);
    const [choice, setChoice] = useState<"red" | "black" | "green" | null>(null);

    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    const [message, setMessage] = useState("");

    const spin = () => {
        if (!choice) return setMessage("❌ Wybierz na co grasz");
        if (bet < 1 || bet > 1000) return setMessage("❌ Stawka 1–1000");
        if (bank < bet) return setMessage("❌ Brak kasy");

        setBank((b) => b - bet);
        setResult(null);
        setMessage("🎡 Kręcimy...");
        setSpinning(true);

        const winNumber = numbers[Math.floor(Math.random() * numbers.length)];

        setTimeout(() => {
            setSpinning(false);
            setResult(winNumber);

            const color =
                winNumber === 0 ? "green" : winNumber % 2 === 0 ? "black" : "red";

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

    const rotation = useMemo(() => {
        if (!spinning) return 0;
        const spins = 6 + Math.random() * 4;
        return spins * 360 + Math.random() * 360;
    }, [spinning]);

    return (
        <main className="roulettePage">
            <div className="rouletteTop">
                <div className="bank">💰 Bank: {bank} zł</div>

                <div className="betBox">
                    <div className="betLabel">🎯 Stawka: {bet} zł</div>
                    <input
                        className="betSlider"
                        type="range"
                        min="1"
                        max="1000"
                        value={bet}
                        onChange={(e) => setBet(Number(e.target.value))}
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
            </div>

            <div className="rouletteArea">
                <div className="wheelWrap">
                    <svg
                        className={`wheelSvg ${spinning ? "spin" : ""}`}
                        viewBox="0 0 500 500"
                        style={{
                            transform: spinning ? `rotate(${rotation}deg)` : "rotate(0deg)",
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

                        {/* Obręcz */}
                        <circle cx="250" cy="250" r="240" fill="url(#rim)" />

                        {/* Koło */}
                        <g>
                            {numbers.map((n, i) => {
                                const start = (i * 360) / numbers.length;
                                const end = ((i + 1) * 360) / numbers.length;
                                const color = getColor(n);

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
                                        <path d={path} fill={color} stroke="#fff" strokeWidth="2" />
                                        <text
                                            x={tx}
                                            y={ty}
                                            fill="#fff"
                                            fontSize="18"
                                            fontWeight="700"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            transform={`rotate(${midAngle}, ${tx}, ${ty})`}
                                        >
                                            {n}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>

                        {/* Środek */}
                        <circle cx="250" cy="250" r="55" fill="#d4b17c" />
                        <circle cx="250" cy="250" r="35" fill="#7a5a2d" />
                    </svg>

                    {/* wskaznik */}
                    <div className="pointer" />
                    <div className={`ball ${spinning ? "ballSpin" : ""}`} />
                </div>
            </div>
        </main>
    );
}
