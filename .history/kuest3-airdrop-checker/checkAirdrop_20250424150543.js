require('dotenv').config();
const { ethers, isAddress } = require('ethers');
const abi = require('./AirdropAbi.json');

const INFURA_SEPOLIA_URL = process.env.INFURA_SEPOLIA_URL;
const AIRDROP_CONTRACT_ADDRESS = process.env.AIRDROP_CONTRACT_ADDRESS;

console.log('INFURA_SEPOLIA_URL:', INFURA_SEPOLIA_URL);
console.log('AIRDROP_CONTRACT_ADDRESS:', AIRDROP_CONTRACT_ADDRESS);

const provider = new ethers.JsonRpcProvider(INFURA_SEPOLIA_URL);

let contract;

try {
  if (!isAddress(AIRDROP_CONTRACT_ADDRESS)) {
    throw new Error(`❌ Invalid contract address: ${AIRDROP_CONTRACT_ADDRESS}`);
  }
  contract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, abi, provider);
} catch (err) {
  console.error('🚨 컨트랙트 생성 실패:', err.message);
  process.exit(1);
}

const addressesToCheck = [
  '0xAe5820128Bda4B31B016C85e35aE830ad2B6b286',
  '0xF02C78504D55608e12f7b796eb4BbeC89D5be271'
];

async function main() {
  for (const rawAddress of addressesToCheck) {
    try {
      if (!isAddress(rawAddress)) {
        throw new Error(`Invalid address format: ${rawAddress}`);
      }

      const addr = ethers.getAddress(rawAddress); // 체크섬 적용
      const amount = await contract.airdropAmount(addr);
      const claimed = await contract.claimed(addr);

      console.log(`🟢 지갑 주소: ${addr}`);
      console.log(`💰 에어드랍 수량: ${ethers.formatUnits(amount, 18)} KST`);
      console.log(`✅ 클레임 여부: ${claimed}`);
      console.log('-----------------------------');
    } catch (err) {
      console.error(`❌ Error checking ${rawAddress}:`, err.message);
    }
  }
}

main();
