import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { getShopBySlug } from '../../services/shopService';
import { createOrder } from '../../services/orderService';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  const [shop, setShop] = useState(null);
  const [loadingShop, setLoadingShop] = useState(true);
  const [customerName, setCustomerName] = useState(() => localStorage.getItem('customerName') || '');
  const [customerMobile, setCustomerMobile] = useState(() => localStorage.getItem('customerMobile') || '');
  const [nameError, setNameError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [mobileTouched, setMobileTouched] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const validateName = (name) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return "Please enter your name.";
    }
    if (trimmed.length < 3) {
      return "Name must be at least 3 characters.";
    }
    if (trimmed.length > 50) {
      return "Name must be at most 50 characters.";
    }
    const lettersAndSpaces = /^[a-zA-Z\s]+$/;
    if (!lettersAndSpaces.test(trimmed)) {
      return "Name must contain only letters and spaces.";
    }
    return "";
  };

  const validateMobile = (mobile) => {
    if (!mobile) {
      return "Please enter your mobile number.";
    }
    const digitsOnly = /^\d+$/;
    if (!digitsOnly.test(mobile)) {
      return "Only numbers are allowed.";
    }
    if (mobile.length !== 10) {
      return "Mobile number must contain exactly 10 digits.";
    }
    return "";
  };

  useEffect(() => {
    if (customerName) {
      setNameError(validateName(customerName));
    }
    if (customerMobile) {
      setMobileError(validateMobile(customerMobile));
    }
  }, []);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setCustomerName(val);
    localStorage.setItem('customerName', val);
    setNameTouched(true);
    setNameError(validateName(val));
  };

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setCustomerMobile(val);
    localStorage.setItem('customerMobile', val);
    setMobileTouched(true);
    setMobileError(validateMobile(val));
  };

  const isNameValid = customerName.trim().length >= 3 && !validateName(customerName);
  const isMobileValid = customerMobile.length === 10 && !validateMobile(customerMobile);
  const isFormValid = isNameValid && isMobileValid && cart.length > 0;

  const nameBorderClass = (nameTouched || customerName)
    ? (nameError ? 'border-red-500 focus:border-red-500' : 'border-green-500 focus:border-green-500')
    : 'border-[#2d2d2d] focus:border-[#E50914]';

  const mobileBorderClass = (mobileTouched || customerMobile)
    ? (mobileError ? 'border-red-500 focus:border-red-500' : 'border-green-500 focus:border-green-500')
    : 'border-[#2d2d2d] focus:border-[#E50914]';

  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        setLoadingShop(true);
        const res = await getShopBySlug(slug || 'kokkarakko-fried-chicken');
        if (res.success) {
          setShop(res.data);
        } else {
          toast.error('Could not load shop information');
        }
      } catch (err) {
        console.error('Error fetching shop info:', err);
      } finally {
        setLoadingShop(false);
      }
    };
    fetchShopInfo();
  }, [slug]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const finalNameError = validateName(customerName);
    const finalMobileError = validateMobile(customerMobile);

    if (finalNameError || finalMobileError) {
      setNameError(finalNameError);
      setMobileError(finalMobileError);
      setNameTouched(true);
      setMobileTouched(true);
      toast.error('Please fix the validation errors before placing the order.');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    if (!shop?._id) {
      toast.error('Invalid shop context');
      return;
    }

    try {
      setPlacingOrder(true);
      const orderData = {
        shopId: shop._id,
        customerName: customerName.trim(),
        customerMobile: customerMobile.trim(),
        items: cart.map(item => ({
          menuId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getCartTotal()
      };

      const res = await createOrder(orderData);
      if (res.success && res.data) {
        toast.success('Order placed successfully!', { icon: '🍗' });
        clearCart();
        localStorage.removeItem('customerName');
        localStorage.removeItem('customerMobile');
        navigate(`/order-success/${res.data.orderNumber}`);
      } else {
        toast.error(res.message || 'Failed to place order');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error occurred while placing order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loadingShop) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-[#E50914] mb-4" size={40} />
        <p className="font-bold tracking-widest uppercase text-xs text-gray-400">Loading Cart...</p>
      </div>
    );
  }

  const menuUrl = `/menu/${slug || 'kokkarakko-fried-chicken'}`;

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white font-sans pb-16">
      {/* Header */}
      <div className="px-6 py-5 max-w-[1100px] mx-auto border-b border-[#222] flex items-center gap-4">
        <motion.div whileTap={{ scale: 0.9 }} className="inline-block">
          <Link to={menuUrl} className="p-2 hover:bg-[#1A1A1A] rounded-full transition-colors text-gray-400 hover:text-white block">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </motion.div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Your Cart</h1>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{shop?.name || 'Shop'}</p>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 mt-8">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="bg-[#141414] p-6 rounded-full border border-[#222]">
              <ShoppingBag className="w-12 h-12 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Your cart is empty</h2>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">Add some of our delicious hot chicken items to get started!</p>
            </div>
            <Link 
              to={menuUrl} 
              className="bg-[#E50914] hover:bg-[#CC0812] text-white font-bold py-3.5 px-8 rounded-full transition-colors inline-flex items-center gap-2 shadow-lg shadow-red-500/10 text-sm"
            >
              View Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-400">{cart.length} Item(s) Selected</span>
                <Link to={menuUrl} className="text-[#E50914] hover:text-[#CC0812] text-sm font-bold transition-colors">
                  + Add More Products
                </Link>
              </div>

              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item._id} className="bg-[#141414] border border-[#222] rounded-2xl p-4 flex gap-4 items-center">
                    <div className="flex-grow min-w-0">
                      <h3 className="text-white font-bold text-base truncate">{item.name}</h3>
                      <p className="text-[#E50914] font-black text-sm mt-0.5">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center bg-[#1A1A1A] border border-[#2d2d2d] rounded-xl px-2.5 py-1.5 gap-3 shrink-0">
                      <motion.button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        whileTap={{ scale: 0.8 }}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <span className="text-white text-sm font-extrabold w-4 text-center">{item.quantity}</span>
                      <motion.button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        whileTap={{ scale: 0.8 }}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Remove Action */}
                    <motion.button 
                      onClick={() => removeFromCart(item._id)}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Details & Checkout Form */}
            <div className="lg:col-span-5 bg-[#141414] border border-[#222] rounded-3xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-[#222] pb-3">Checkout Details</h2>
              
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Name</label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={handleNameChange}
                    placeholder="Enter full name"
                    className={`w-full bg-[#1A1A1A] text-white placeholder-gray-500 border rounded-xl py-3 px-4 outline-none transition-colors text-sm font-semibold ${nameBorderClass}`}
                    required
                  />
                  {nameError && (nameTouched || customerName) && (
                    <p className="text-red-500 text-xs font-semibold mt-1.5">{nameError}</p>
                  )}
                  {!nameError && (nameTouched || customerName) && customerName.trim() && (
                    <p className="text-green-500 text-xs font-semibold mt-1.5">✓ Name looks good</p>
                  )}
                </div>

                <div>
                  <label htmlFor="customerMobile" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    id="customerMobile"
                    value={customerMobile}
                    onChange={handleMobileChange}
                    placeholder="10-digit mobile number"
                    className={`w-full bg-[#1A1A1A] text-white placeholder-gray-500 border rounded-xl py-3 px-4 outline-none transition-colors text-sm font-semibold ${mobileBorderClass}`}
                    required
                  />
                  {mobileError && (mobileTouched || customerMobile) && (
                    <p className="text-red-500 text-xs font-semibold mt-1.5">{mobileError}</p>
                  )}
                  {!mobileError && (mobileTouched || customerMobile) && customerMobile.length === 10 && (
                    <p className="text-green-500 text-xs font-semibold mt-1.5">✓ Mobile number is valid</p>
                  )}
                </div>

                {/* Bill Summary */}
                <div className="bg-[#1A1A1A] rounded-2xl p-4 mt-6 space-y-2 border border-[#2d2d2d]">
                  <div className="flex justify-between items-center text-sm font-bold text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-gray-400">
                    <span>Delivery / Table Service</span>
                    <span className="text-green-500 font-extrabold">FREE</span>
                  </div>
                  <div className="border-t border-[#2d2d2d] my-2 pt-2 flex justify-between items-center">
                    <span className="text-base font-extrabold text-white">Grand Total</span>
                    <span className="text-xl font-black text-[#E50914]">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={!isFormValid || placingOrder}
                  whileTap={isFormValid && !placingOrder ? { scale: 0.96 } : {}}
                  className="w-full bg-[#E50914] hover:bg-[#CC0812] disabled:bg-neutral-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-500/10 flex items-center justify-center gap-2 mt-4 text-sm uppercase tracking-wider"
                >
                  {placingOrder ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" /> Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
