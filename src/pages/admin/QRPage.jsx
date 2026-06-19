import { useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';
import { Download, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

const QRPage = () => {
  const { shop } = useAuth();
  const qrRef = useRef();

  if (!shop) return null;

  const fullShopUrl = `${window.location.origin}/shop/${shop.slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(fullShopUrl);
    toast.success('Shop link copied to clipboard!');
  };

  const downloadQR = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      // Add padding for professional look
      canvas.width = img.width + 80;
      canvas.height = img.height + 80;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 40, 40);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${shop.slug}-qr.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 text-center md:text-left">QR Code Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200" ref={qrRef}>
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <QRCode
              value={fullShopUrl}
              size={256}
              level="H"
              fgColor="#111111"
              bgColor="#ffffff"
            />
          </div>
          <h2 className="mt-6 text-2xl font-black text-[#E50914] tracking-wide uppercase">{shop.shopName}</h2>
          <p className="text-gray-500 text-sm mt-1">Scan to order</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Print & Place in Shop</h3>
            <p className="text-gray-500">Download this high-quality QR code and place it on your tables or billing counter. Customers can scan it to view the menu instantly without downloading any app.</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 break-all">
            <p className="text-sm font-semibold text-gray-500 mb-1">Direct Link</p>
            <a href={fullShopUrl} target="_blank" rel="noreferrer" className="text-[#E50914] hover:underline font-medium">
              {fullShopUrl}
            </a>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadQR}
              className="flex-1 bg-[#111111] hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Download size={20} /> Download PNG
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={copyLink}
              className="flex-1 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Copy size={20} /> Copy Link
            </motion.button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QRPage;
