'use client';

import { useState } from 'react';
import Arweave from 'arweave';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

export default function FileUpload({ onUpload, walletKey }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !walletKey) return;

    setLoading(true);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = async () => {
      const data = new Uint8Array(reader.result);
      const transaction = await arweave.createTransaction({ data }, walletKey);

      transaction.addTag('Content-Type', file.type);

      await arweave.transactions.sign(transaction, walletKey);
      const response = await arweave.transactions.post(transaction);

      if (response.status === 200) {
        const txId = transaction.id;
        const imageUrl = `https://arweave.net/${txId}`;
        onUpload(imageUrl);
      } else {
        console.error('Failed to upload file to Arweave');
      }

      setLoading(false);
    };
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? 'Uploading...' : 'Upload to Arweave'}
      </button>
    </div>
  );
}
