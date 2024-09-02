"use client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
function moneylineToImpliedProbability(moneyline: string, isLoss = false): number {
  const ml = parseInt(moneyline);
  if (isNaN(ml)) return 0;
  
  if (ml > 0) {
    return isLoss ? (100 / (ml + 100)) * 100 : 100 / (ml + 100);
  } else {
    return isLoss ? ((-ml) / (-ml + 100)) * 100 : (-ml) / (-ml + 100);
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
  const roi = (netWin / wagerFloat) * 100 || 0;

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sports Betting Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="Moneyline Odds"
            onChange={(e) => setOdds(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Wager"
            onChange={(e) => setWager(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Win Probability</TableHead>
                <TableHead>Win Amount</TableHead>
                <TableHead>ROI</TableHead>
                <TableHead>Loss Probability</TableHead>
                <TableHead>Loss Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  {moneylineToImpliedProbability(odds).toFixed(2)}%
                </TableCell>
                <TableCell>${netWin.toFixed(2)}</TableCell>
                <TableCell>{roi.toFixed(2)}%</TableCell>
                <TableCell>
                  {moneylineToImpliedProbability(odds, true).toFixed(2)}%
                </TableCell>
                <TableCell>${wagerFloat.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
