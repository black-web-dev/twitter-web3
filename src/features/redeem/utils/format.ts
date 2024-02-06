import BigNumber from "bignumber.js";
import { formatUnits } from "viem";

import { RedeemData } from "../types";

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function bnum(val: string | number | BigNumber): BigNumber {
  const number = typeof val === "string" ? val : val ? val.toString() : "0";
  return new BigNumber(number);
}

export function formatRedeem({ data }: RedeemData) {
  const claimStatus = data[0].result || 0;
  const cCCBalance = data[1].result || 0;
  const wETHBalance = data[2].result || 0;
  const ccPrice = data[3].result || 0;
  const wETHPrice = data[4].result || 0;
  const discount = data[5].result || 0;

  return {
    claimStatus,
    cCCBalance: formatUnits(cCCBalance, 18),
    wETHBalance: formatUnits(wETHBalance, 18),
    ccPrice: formatUnits(ccPrice, 0),
    wETHPrice: formatUnits(wETHPrice, 0),
    discount: formatUnits(discount, 0),
  };
}

export function getWETHFromCC({
  amount,
  ccPrice,
  wETHPrice,
  discount,
}: {
  amount: string;
  ccPrice: string;
  wETHPrice: string;
  discount: string;
}) {
  if (
    bnum(amount).gt(0) &&
    bnum(ccPrice).gt(0) &&
    bnum(wETHPrice).gt(0) &&
    bnum(discount).gt(0)
  ) {
    return bnum(amount)
      .times(ccPrice)
      .times(110)
      .div(wETHPrice)
      .div(discount)
      .toString();
  } else {
    return "0";
  }
}
