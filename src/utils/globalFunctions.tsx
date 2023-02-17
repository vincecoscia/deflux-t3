export const getBalance = (trades ,setBalance) => {
  // Get account balance by grabbing the first trade balance
  const balance = trades[0]?.balance;
  setBalance(balance);
};