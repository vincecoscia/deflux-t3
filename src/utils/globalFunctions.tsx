export const getBalance = (trades ,setBalance) => {
  // Get account balance by grabbing the first trades balance
  if (trades.length > 0) {
    setBalance(trades[0].balance);
  }
};