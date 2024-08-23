import Arweave from 'arweave';

export function getArweaveInstance() {
  return Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  });
}

export function getWalletKey() {
  const walletKey = JSON.parse(process.env.ARWEAVE_WALLET_KEY);
  return walletKey;
}
