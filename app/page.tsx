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

// Add this function at the top of your file, outside the Home component
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(num);
};

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
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">1. Select Odds</h3>
              <div className="flex-grow flex flex-wrap justify-between gap-2 ml-4">
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
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">2. Set Win Amount</h3>
              <div className="flex-grow flex flex-wrap justify-between gap-2 ml-4">
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
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">3. Set Wager Amount</h3>
              <div className="flex-grow flex flex-wrap justify-between gap-2 ml-4">
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
        </CardContent>
      </Card>

      {/* New separate card for Bet Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Bet Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Inputs */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="text-lg font-medium mb-2 text-blue-800">Your Inputs</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-blue-600 mb-1">Odds</p>
                <p className="text-3xl font-bold text-blue-900">
                  {odds ? (parseInt(odds) > 0 ? `+${odds}` : odds) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-600 mb-1">Wager</p>
                <p className="text-3xl font-bold text-blue-900">
                  ${formatNumber(parseFloat(wager || "0"))}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-600 mb-1">To Win</p>
                <p className="text-3xl font-bold text-blue-900">
                  ${formatNumber(parseFloat(winAmount || "0"))}
                </p>
              </div>
            </div>
          </div>

          {/* Potential Loss */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <h4 className="text-lg font-medium mb-2 text-red-800">
              Potential Loss
            </h4>
            <p className="text-3xl font-bold text-red-600">
              -${formatNumber(parseFloat(wager || "0"))}
            </p>
            <p className="text-sm text-red-700 mt-2">
              Probability: {(lossProbability * 100).toFixed(2)}%
            </p>
          </div>

          {/* Potential Gain */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h4 className="text-lg font-medium mb-2 text-green-800">
              Potential Gain
            </h4>
            <p className="text-3xl font-bold text-green-600">
              +${formatNumber(parseFloat(winAmount || "0"))}
            </p>
            <p className="text-sm text-green-700 mt-2">
              Probability: {(winProbability * 100).toFixed(2)}%
            </p>
          </div>

          {/* ROI */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="text-lg font-medium mb-2 text-amber-800">
              Return on Investment (ROI)
            </h4>
            <p className="text-3xl font-bold text-amber-700">
              {formatNumber(roi)}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
