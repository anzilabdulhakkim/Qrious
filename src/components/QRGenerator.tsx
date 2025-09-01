import React, { useState } from 'react';
import QRCode from 'qrcode';

const DemoQRGenerator: React.FC = () => {
  const [input, setInput] = useState('https://example.com');
  const [qrUrl, setQrUrl] = useState<string>('');

  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(input, { width: 256, margin: 2 });
      setQrUrl(url);
    } catch (err) {
      console.error('QR generation failed:', err);
    }
  };

  const downloadQR = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'demo-qr.png';
    link.click();
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <h1 className="text-2xl font-bold">Demo QR Generator</h1>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text or URL"
        className="border rounded px-3 py-2 w-80"
      />
      <button
        onClick={generateQR}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Generate
      </button>

      {qrUrl && (
        <div className="flex flex-col items-center space-y-3">
          <img src={qrUrl} alt="Generated QR" className="w-64 h-64" />
          <button
            onClick={downloadQR}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
};

export default DemoQRGenerator;
