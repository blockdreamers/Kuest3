// convertFirebaseJsonPrivateKey.js

// 🔐 Firebase JSON에서 복붙한 한 줄짜리 키값 (쌍따옴표까지 포함해서 복붙)
const rawPrivateKey = ;

// 🔁 \n → \\n 처리
const escapedKey = rawPrivateKey.replace(/\n/g, '\\n');

// ✅ .env 포맷으로 변환
const envLine = `FIREBASE_PRIVATE_KEY="${escapedKey}"`;

// 출력 (Netlify에 붙여넣기용)
console.log(envLine);
