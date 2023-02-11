export const getBalance = (trades ,setBalance) => {
  // Get account balance by grabbing the last trades balance
  const lastTrade = trades[trades.length - 1];
  if (lastTrade) {
    setBalance(lastTrade.balance);
  }
};