module.exports = {
  '*.{ts,tsx,js,jsx,json,css,md,babelrc,prettierrc,watchmanconfig}': [
    'node node_modules/prettier/bin-prettier.js --write',
    'git add',
  ],
  '*.{ts,tsx}': [
    'node node_modules/tslint/bin/tslint -c tslint.json --fix',
    'git add',
  ],
};
