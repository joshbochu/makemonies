"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Add these functions
function moneylineToImpliedProbability(moneyline: string): number {
  const ml = parseInt(moneyline);
  if (isNaN(ml)) return 0;

  if (ml > 0) {
    return 100 / (ml + 100);
  } else {
    return Math.abs(ml) / (Math.abs(ml) + 100);
  }
}

function calculateNetWin(odds: string, wager: string): number {
  const ml = parseInt(odds);
  const wagerAmount = parseFloat(wager);

  if (isNaN(ml) || isNaN(wagerAmount)) return 0;

  if (ml > 0) {
    return (wagerAmount * ml) / 100;
  } else {
    return (wagerAmount * 100) / Math.abs(ml);
  }
}

export default function Home() {
  const [odds, setOdds] = useState("");
  const [winAmount, setWinAmount] = useState("");
  const [wager, setWager] = useState("");

  const commonOdds = [-500, -400, -300, -200, -100, 100, 200, 300, 400, 500];
  const commonWinAmounts = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  const commonWagers = [10, 25, 50, 100, 250, 500, 1000];

  const calculateWager = (toWin: number): number => {
    const ml = parseInt(odds);
    if (isNaN(ml)) return 0;

    let calculatedWager;
    if (ml > 0) {
      calculatedWager = (toWin * 100) / ml;
    } else {
      calculatedWager = (toWin * Math.abs(ml)) / 100;
    }
    return calculatedWager;
  };

  const updateWinAmount = (newWinAmount: string) => {
    setWinAmount(newWinAmount);
    setWager(calculateWager(parseFloat(newWinAmount)).toFixed(2));
  };

  const updateWager = (newWager: string) => {
    setWager(newWager);
    const ml = parseInt(odds);
    if (!isNaN(ml)) {
      const calculatedWin =
        ml > 0
          ? (parseFloat(newWager) * ml) / 100
          : (parseFloat(newWager) * 100) / Math.abs(ml);
      setWinAmount(calculatedWin.toFixed(2));
    }
  };

  const netWin = calculateNetWin(odds, wager);
  const wagerFloat = parseFloat(wager) || 0;
  const winProbability = moneylineToImpliedProbability(odds);
  const lossProbability = 1 - winProbability;
  const roi = (netWin / wagerFloat) * 100 || 0;

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sports Betting Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">1. Select Odds</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {commonOdds.map((odd) => (
                <button
                  key={odd}
                  className={`px-3 py-1 text-sm border rounded transition-colors ${
                    odds === odd.toString()
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-secondary"
                  }`}
                  onClick={() => setOdds(odd.toString())}
                >
                  {odd > 0 ? `+${odd}` : odd}
                </button>
              ))}
            </div>
            <div className="text-center my-4">
              <span className="text-gray-600 text-sm font-medium">OR</span>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <Input
                  type="number"
                  placeholder="Enter custom odds"
                  value={odds}
                  onChange={(e) => setOdds(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">2. Set Win Amount</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {commonWinAmounts.map((amount) => (
                <button
                  key={amount}
                  className={`px-2 py-1 text-sm border rounded transition-colors ${
                    winAmount === amount.toString()
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-secondary"
                  }`}
                  onClick={() => updateWinAmount(amount.toString())}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div className="text-center my-4">
              <span className="text-gray-600 text-sm font-medium">OR</span>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <Input
                  type="number"
                  placeholder="Enter custom win amount"
                  value={winAmount}
                  onChange={(e) => updateWinAmount(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">3. Set Wager Amount</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {commonWagers.map((amount) => (
                <button
                  key={amount}
                  className={`px-2 py-1 text-sm border rounded transition-colors ${
                    wager === amount.toString()
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-secondary"
                  }`}
                  onClick={() => updateWager(amount.toString())}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div className="text-center my-4">
              <span className="text-gray-600 text-sm font-medium">OR</span>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <Input
                  type="number"
                  placeholder="Enter custom wager amount"
                  value={wager}
                  onChange={(e) => updateWager(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Add the new bet summary section here */}
          <div className="bg-stone-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Bet Summary</h3>

            {/* User Inputs */}
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Your Inputs</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Odds</p>
                  <p className="text-lg font-medium">
                    {odds ? (parseInt(odds) > 0 ? `+${odds}` : odds) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wager</p>
                  <p className="text-lg font-medium">
                    ${parseFloat(wager || "0").toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">To Win</p>
                  <p className="text-lg font-medium">
                    ${parseFloat(winAmount || "0").toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Potential Outcomes */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-red-100 rounded-lg">
                <h4 className="text-lg font-medium mb-2 text-red-800">
                  Potential Loss
                </h4>
                <p className="text-3xl font-bold text-red-600">
                  -${parseFloat(wager || "0").toFixed(2)}
                </p>
                <p className="text-sm text-red-800 mt-2">
                  Probability: {(lossProbability * 100).toFixed(2)}%
                </p>
              </div>
              <div className="p-4 bg-green-100 rounded-lg">
                <h4 className="text-lg font-medium mb-2 text-green-800">
                  Potential Gain
                </h4>
                <p className="text-3xl font-bold text-green-600">
                  +${parseFloat(winAmount || "0").toFixed(2)}
                </p>
                <p className="text-sm text-green-800 mt-2">
                  Probability: {(winProbability * 100).toFixed(2)}%
                </p>
              </div>
            </div>

            {/* ROI */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-1">Return on Investment (ROI)</p>
              <div className="inline-block bg-amber-50 text-amber-900 text-2xl font-bold px-6 py-3 rounded-full border border-amber-200">
                {roi.toFixed(2)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
