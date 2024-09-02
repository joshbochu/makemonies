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
  const [wager, setWager] = useState("");

  const netWin = calculateNetWin(odds, wager);
  const wagerFloat = parseFloat(wager) || 0;
  const winProbability = moneylineToImpliedProbability(odds);
  const lossProbability = 1 - winProbability;
  const roi = (netWin / wagerFloat) * 100 || 0;

  const commonOdds = [-500, -400, -300, -200, -100, 100, 200, 300, 400, 500];
  const toWinAmounts = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

  const setWagerForToWin = (toWin: number): number => {
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
            <h3 className="text-lg font-semibold mb-2">2. Set Wager</h3>
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <Input
                  type="number"
                  placeholder="Enter wager amount"
                  value={wager}
                  onChange={(e) => setWager(e.target.value)}
                />
              </div>
              <span>or</span>
              <div>
                <label className="text-sm font-medium mb-1 block">To Win:</label>
                <div className="flex flex-wrap gap-2">
                  {toWinAmounts.map((amount) => (
                    <button
                      key={amount}
                      className={`px-2 py-1 text-sm border rounded transition-colors ${
                        parseFloat(wager) === setWagerForToWin(amount)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background hover:bg-secondary'
                      }`}
                      onClick={() => setWager(setWagerForToWin(amount).toFixed(2))}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Bet Summary</h3>
            <p>Odds: {odds ? (parseInt(odds) > 0 ? `+${odds}` : odds) : 'N/A'}</p>
            <p>Wager: ${parseFloat(wager || '0').toFixed(2)}</p>
            <p>Potential Win: ${netWin.toFixed(2)}</p>
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
