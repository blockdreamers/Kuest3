require('dotenv').config();
const { ethers } = require('ethers');
const abi = require('./AirdropAbi.json');

// ✅ 환경변수 확인
console.log('INFURA_SEPOLIA_URL:', process.env.INFURA_SEPOLIA_URL);
console.log('AIRDROP_CONTRACT_ADDRESS:', process.env.AIRDROP_CONTRACT_ADDRESS);

// ✅ Provider 생성 방식 (ethers v6 이상 대응)
const provider = new ethers.JsonRpcProvider({
  url: process.env.INFURA_SEPOLIA_URL,
  allowGzip: true,
  skipFetchSetup: true
});

const contract = new ethers.Contract(process.env.AIRDROP_CONTRACT_ADDRESS, abi, provider);

const addressesToCheck = [
  '0xAe5820128Bda4B31B016C85e35aE830ad2B6b286',
  '0xF02C78504D55608e12f7b796eb4BbeC89D5be271'
];

async function main() {
  for (const address of addressesToCheck) {
    try {
      const amount = await contract.airdropAmount(address);
      const claimed = await contract.claimed(address);

      console.log(`🟢 Address: ${address}`);
      console.log(`💰 Claimable: ${ethers.formatUnits(amount, 18)} KST`);
      console.log(`✅ Already Claimed: ${claimed}`);
      console.log('-------------------------------');
    } catch (err) {
      console.error(`❌ Error checking ${address}:`, err.message);
    }
  }
}

main();
