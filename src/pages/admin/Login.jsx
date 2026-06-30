import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { loginContext } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success('Login Successful!');
        await loginContext(res.data);
        navigate('/owner/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#111111] rounded-2xl shadow-2xl border border-white/5 overflow-hidden relative"
      >
        <div className="p-8 text-center relative overflow-hidden pb-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#D90404]"></div>
          
          {/* Back to Home Button */}
          <button 
            onClick={() => navigate('/')} 
            className="absolute top-4 left-4 flex items-center gap-2 text-sm md:text-base text-gray-400 hover:text-white font-bold transition-colors z-20"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <img src="/logo.png" alt="Logo" className="mx-auto h-28 w-auto object-contain mb-4 rounded-full shadow-lg" />
          <h2 className="text-3xl font-black text-white uppercase tracking-wider">Kokkarakko</h2>
          <p className="text-gray-400 mt-2 font-medium">Owner Portal Login</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-2 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-[#1a1a1a] text-white focus:border-[#D90404] focus:ring-2 focus:ring-red-900/30 outline-none transition-all placeholder-gray-600"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-[#1a1a1a] text-white focus:border-[#D90404] focus:ring-2 focus:ring-red-900/30 outline-none transition-all placeholder-gray-600"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D90404] hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-red-500/30 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Sign In to Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
