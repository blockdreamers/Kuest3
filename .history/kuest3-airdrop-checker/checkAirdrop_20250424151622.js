require('dotenv').config();
const { ethers } = require('ethers');
const abi = require('./AirdropAbi.json');

// 환경변수 불러오기 (줄바꿈 제거)
const INFURA_SEPOLIA_URL = process.env.INFURA_SEPOLIA_URL?.trim();
const AIRDROP_CONTRACT_ADDRESS = process.env.AIRDROP_CONTRACT_ADDRESS?.trim();

console.log('INFURA_SEPOLIA_URL:', INFURA_SEPOLIA_URL);
console.log('AIRDROP_CONTRACT_ADDRESS:', AIRDROP_CONTRACT_ADDRESS);
console.log('📍 유효한 contract address인지 체크:', ethers.isAddress(AIRDROP_CONTRACT_ADDRESS));
console.log("🔍 Contract address (raw):", JSON.stringify(process.env.AIRDROP_CONTRACT_ADDRESS));
console.log("🔍 Contract address length:", process.env.AIRDROP_CONTRACT_ADDRESS.length);
console.log("🧪 Length check:", process.env.AIRDROP_CONTRACT_ADDRESS.trim().length);

if (!ethers.isAddress(AIRDROP_CONTRACT_ADDRESS)) {
  console.error('🚨 컨트랙트 생성 실패: ❌ Invalid contract address:', AIRDROP_CONTRACT_ADDRESS);
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(INFURA_SEPOLIA_URL);
const contract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, abi, provider);

const addressesToCheck = [
  '0xAe5820128Bda4B31B016C85e35aE830ad2B6b286',
  '0xF02C78504D55608e12f7b796eb4BbeC89D5be271'
];

async function main() {
  for (const address of addressesToCheck) {
    try {
      const amount = await contract.airdropAmount(address);
      const claimed = await contract.claimed(address);

      console.log('📍 Address:', address);
      console.log('💰 Claimable:', `${ethers.formatUnits(amount, 18)} KST`);
      console.log(`✅ Already Claimed: ${claimed}`);
      console.log('--------------------------');
    } catch (err) {
      console.error(`❌ Error checking ${address}:`, err.message);
    }
  }
}

main();
