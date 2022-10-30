node build.js
rm -rf contract.js
sed '$d' dist/app.js >> contract_temp.js
sed '2d' contract_temp.js >> contract.js
rm -rf contract_temp.js
yarn ts-node tools/deployContract.ts