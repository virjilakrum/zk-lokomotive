import { getWalletKey } from "./lib/arweave";
import NftForm from "./components/NftForm";

export default function Home() {
  const walletKey = getWalletKey();

  return (
    <div>
      <h1>File Metadata</h1>
      <NftForm walletKey={walletKey} />
    </div>
  );
}
