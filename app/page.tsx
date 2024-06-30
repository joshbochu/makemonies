"use client";
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

export default function Home() {
  const [odds, setOdds] = useState("");
  const [wager, setWager] = useState("");

  const netWin = calculateNetWin(odds, wager);
  const wagerFloat = parseFloat(wager) || 0;
  const roi = (netWin / wagerFloat) * 100 || 0;

  return (
    <>
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
    </>
  );
}

function moneylineToImpliedProbability(
  odds: string,
  complement: boolean = false
): number {
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
  impliedProbability *= 100;

  return complement ? 100 - impliedProbability : impliedProbability;
}

function calculateNetWin(odds: string, wager: string): number {
  const moneyline = parseFloat(odds);
  const wagerFloat = parseFloat(wager);
  if (isNaN(moneyline) || isNaN(wagerFloat)) {
    return 0;
  }
  let netWin: number;
  if (moneyline > 0) {
    netWin = (moneyline / 100) * wagerFloat;
  } else {
    netWin = (100 / -moneyline) * wagerFloat;
  }
  return netWin;
}
