import { useRef, useState, useEffect } from 'react';
import { useCurrentShop } from '../../hooks/useCurrentShop';
import { getQRAnalytics } from '../../services/qrService';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';
import { Download, Copy, Link as LinkIcon, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

// StatCard removed as per cleanup requirements

const QRPage = () => {
  const { shopId, shopSlug, shopName, loading: shopLoading, error: shopError } = useCurrentShop();
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const qrRef = useRef();

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!shopId) return;
      try {
        const res = await getQRAnalytics(shopId);
        if (res.success) {
          setAnalytics(res.data);
        }
      } catch (error) {
        toast.error('Failed to load QR analytics');
      } finally {
        setLoadingAnalytics(false);
      }
    };
    if (shopId) {
      fetchAnalytics();
    }
  }, [shopId]);

  if (shopLoading || loadingAnalytics) return <LoadingState message="Loading QR Dashboard..." />;
  if (shopError) return <ErrorState message={shopError} />;
  
  const displayAnalytics = analytics || {
    totalScans: 0,
    dailyScans: 0,
    weeklyScans: 0,
    lastScannedAt: null,
    scansPerDay: []
  };

  if (!shopSlug || !displayAnalytics) return null;

  const fullShopUrl = `${window.location.origin}/shop/${shopSlug}`;

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
      downloadLink.download = `${shopSlug}-qr.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-4xl mx-auto pb-10 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-[28px] md:text-3xl font-bold text-gray-900 tracking-tight leading-tight truncate">QR Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start w-full">
        
        <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 w-full overflow-hidden" ref={qrRef}>
          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-center max-w-[180px] sm:max-w-xs mx-auto">
            <QRCode
              value={fullShopUrl}
              size={220}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              level="H"
              fgColor="#111111"
              bgColor="#ffffff"
            />
          </div>
          <h2 className="mt-6 text-xl sm:text-2xl font-black text-[#E50914] tracking-wide uppercase text-center truncate w-full">{shopName}</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Scan to order</p>
        </div>

        <div className="space-y-5 w-full">
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadQR}
              className="w-full h-11 md:h-12 bg-[#111111] hover:bg-black text-white font-semibold text-[15px] rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <Download size={18} /> Download High-Res PNG
            </motion.button>
          </div>

          <div className="bg-white p-[18px] sm:p-5 md:p-6 rounded-[16px] shadow-sm border border-gray-100 space-y-3.5 w-full overflow-hidden">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">QR Information</h3>
            
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 gap-2 overflow-hidden">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <LinkIcon className="text-blue-500 shrink-0" size={20} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-semibold mb-0.5">Generated URL</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 break-all pr-1">{fullShopUrl}</p>
                </div>
              </div>
              <button onClick={copyLink} className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-gray-500 hover:bg-white hover:shadow-sm rounded-lg transition-all shrink-0">
                <Copy size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 font-semibold mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p className="text-sm font-bold text-gray-900">Active</p>
                </div>
              </div>
              <div className="p-2.5 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1"><Clock size={12}/> Last Scanned</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                  {displayAnalytics.lastScannedAt ? new Date(displayAnalytics.lastScannedAt).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>

          </div>

          <div className="bg-blue-50 p-4 sm:p-6 rounded-2xl border border-blue-100">
            <h3 className="text-sm font-bold text-blue-900 mb-2">Print & Place in Shop</h3>
            <p className="text-blue-700 text-xs sm:text-sm leading-relaxed">Download this high-quality QR code and place it on your tables or billing counter. Customers can scan it to view the menu instantly without downloading any app.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QRPage;
