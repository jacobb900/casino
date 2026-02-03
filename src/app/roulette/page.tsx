"use client";
import { useMemo, useState } from "react";

const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30,
    8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7,
    28, 12, 35, 3, 26,
];

const getColor = (n: number) =>
    n === 0 ? "green" : n % 2 === 0 ? "black" : "red";

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

            const color = getColor(winNumber);

            if (choice === "green" && winNumber === 0) {
                setBank((b) => b + bet * 14);
                setMessage("🎉 JACKPOT! Wypadło 0");
            } else if (choice === color) {
                setBank((b) => b + bet * 2);
                setMessage(`🎉 WYGRAŁEŚ! Wypadło ${winNumber} (${color})`);
            } else {
                setMessage(`😢 Przegrałeś — ${winNumber} (${color})`);
            }
        }, 3000);
    };

    const rotation = useMemo(() => {
        if (!spinning) return 0;
        const spins = 5 + Math.random() * 3; // 5-8 obrotów
        return spins * 360;
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
                    <div
                        className="wheel"
                        style={{
                            transform: spinning ? `rotate(${rotation}deg)` : `rotate(0deg)`,
                            transition: spinning
                                ? "transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)"
                                : "none",
                        }}
                    >
                        {numbers.map((n, i) => (
                            <div
                                key={i}
                                className={`wheelNum ${getColor(n)}`}
                                style={{
                                    transform: `rotate(${i * (360 / numbers.length)}deg)`,
                                }}
                            >
                <span
                    style={{
                        transform: `rotate(${-i * (360 / numbers.length)}deg)`,
                    }}
                >
                  {n}
                </span>
                            </div>
                        ))}
                    </div>

                    <div className={`ball ${spinning ? "ballSpin" : ""}`} />
                    <div className="wheelCenter" />
                </div>
            </div>
        </main>
    );
}
