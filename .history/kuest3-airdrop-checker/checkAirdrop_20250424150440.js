require('dotenv').config();
const { ethers } = require('ethers');
const abi = require('./AirdropAbi.json');

const AIRDROP_CONTRACT_ADDRESS = ethers.getAddress(process.env.AIRDROP_CONTRACT_ADDRESS); // 👈 여기 중요!
const INFURA_SEPOLIA_URL = process.env.INFURA_SEPOLIA_URL;

console.log('INFURA_SEPOLIA_URL:', INFURA_SEPOLIA_URL);
console.log('AIRDROP_CONTRACT_ADDRESS:', AIRDROP_CONTRACT_ADDRESS);

const provider = new ethers.JsonRpcProvider(INFURA_SEPOLIA_URL);
const contract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, abi, provider);

const addressesToCheck = [
  '0xAe5820128Bda4B31B016C85e35aE830ad2B6b286',
  '0xF02C78504D55608e12f7b796eb4BbeC89D5be271'
];

async function main() {
  for (const address of addressesToCheck) {
    try {
      const targetAddress = ethers.getAddress(address); // 👈 이것도 추가
      const amount = await contract.airdropAmount(targetAddress);
      const claimed = await contract.claimed(targetAddress);

      console.log(`🟢 Address: ${targetAddress}`);
      console.log(`💰 Claimable: ${ethers.formatUnits(amount, 18)} KST`);
      console.log(`✅ Already Claimed: ${claimed}`);
      console.log('-------------------------------');
    } catch (err) {
      console.error(`❌ Error checking ${address}:`, err.message);
    }
  }
}

main();
