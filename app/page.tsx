"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      const calculatedWin = ml > 0 
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
            <div className="flex flex-wrap gap-2 mb-2">
              {commonOdds.map((odd) => (
                <button
                  key={odd}
                  className={`px-3 py-1 text-sm border rounded transition-colors ${
                    odds === odd.toString() ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-secondary'
                  }`}
                  onClick={() => setOdds(odd.toString())}
                >
                  {odd > 0 ? `+${odd}` : odd}
                </button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Or enter custom odds"
              value={odds}
              onChange={(e) => setOdds(e.target.value)}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">2. Set Win Amount</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonWinAmounts.map((amount) => (
                <button
                  key={amount}
                  className={`px-2 py-1 text-sm border rounded transition-colors ${
                    winAmount === amount.toString() ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-secondary'
                  }`}
                  onClick={() => updateWinAmount(amount.toString())}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Enter win amount"
              value={winAmount}
              onChange={(e) => updateWinAmount(e.target.value)}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">3. Set Wager Amount</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonWagers.map((amount) => (
                <button
                  key={amount}
                  className={`px-2 py-1 text-sm border rounded transition-colors ${
                    wager === amount.toString() ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-secondary'
                  }`}
                  onClick={() => updateWager(amount.toString())}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Enter wager amount"
              value={wager}
              onChange={(e) => updateWager(e.target.value)}
            />
          </div>

          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Bet Summary</h3>
            <p>Odds: {odds ? (parseInt(odds) > 0 ? `+${odds}` : odds) : 'N/A'}</p>
            <p>Wager: ${parseFloat(wager || '0').toFixed(2)}</p>
            <p>To Win: ${parseFloat(winAmount || '0').toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Win Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Win Probability</TableHead>
                <TableHead>Win Amount</TableHead>
                <TableHead>ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{(winProbability * 100).toFixed(2)}%</TableCell>
                <TableCell>${netWin.toFixed(2)}</TableCell>
                <TableCell>{roi.toFixed(2)}%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loss Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loss Probability</TableHead>
                <TableHead>Loss Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{(lossProbability * 100).toFixed(2)}%</TableCell>
                <TableCell>${wagerFloat.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
