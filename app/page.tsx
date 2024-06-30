"use client";
import { useState } from "react";

export default function Home() {
  const [odds, setOdds] = useState("");
  const [bet, setBet] = useState("");

  const netWin = calculateNetWin(odds, bet);
  const amountLost = parseFloat(bet) || 0;

  return (
    <div>
      <label>
        Moneyline Odds:
        <input
          name="odds"
          value={odds}
          onChange={(e) => setOdds(e.target.value)}
        />
      </label>
      <label>
        Bet:
        <input
          name="bet"
          value={bet}
          onChange={(e) => setBet(e.target.value)}
        />
      </label>
      <div>
        Implied Probability: {moneylineToImpliedProbability(odds).toFixed(2)}%
      </div>
      <div>To win: ${netWin.toFixed(2)}</div>
      <div>To lose: ${amountLost.toFixed(2)}</div>
    </div>
  );
}

function moneylineToImpliedProbability(odds: string): number {
  const moneyline = parseFloat(odds);
  if (isNaN(moneyline)) {
    return 0;
  }
  let impliedProbability: number;
  if (moneyline > 0) {
    impliedProbability = 100 / (moneyline + 100);
  } else {
    impliedProbability = -moneyline / (-moneyline + 100);
  }
  return impliedProbability * 100;
}

function calculateNetWin(odds: string, bet: string): number {
  const moneyline = parseFloat(odds);
  const betAmount = parseFloat(bet);
  if (isNaN(moneyline) || isNaN(betAmount)) {
    return 0;
  }
  let netWin: number;
  if (moneyline > 0) {
    netWin = (moneyline / 100) * betAmount;
  } else {
    netWin = (100 / -moneyline) * betAmount;
  }
  return netWin;
}
