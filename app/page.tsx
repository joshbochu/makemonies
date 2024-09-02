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

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sports Betting Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {commonOdds.map((odd) => (
              <button
                key={odd}
                className="px-2 py-1 text-sm border rounded"
                onClick={() => setOdds(odd.toString())}
              >
                {odd > 0 ? `+${odd}` : odd}
              </button>
            ))}
          </div>
          <Input
            type="number"
            placeholder="Moneyline Odds"
            value={odds}
            onChange={(e) => setOdds(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Wager"
            value={wager}
            onChange={(e) => setWager(e.target.value)}
          />
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
