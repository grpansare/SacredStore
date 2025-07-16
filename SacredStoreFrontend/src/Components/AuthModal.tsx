import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Heart,
  Star,
  Sun,
  X,
} from "lucide-react";
import AuthService from "../api/auth"; // Ensure this path is correct
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginSuccess } from "../store/UserSlice";


interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}
// --- End Type Definitions ---

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        // --- Login Logic ---
        const res=  await AuthService.login(formData.email, formData.password);
        console.log(res);
        dispatch(loginSuccess(res))
       if(res.roles[0].name == "ROLE_ADMIN"){
          navigate("/admin");
        }else if(res.roles[0].name == "ROLE_USER"){ 
             setMessage("Login successful!");
          onClose()
          setFormData({
            firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,   
          });
          setMessage("");
          setIsLogin(true);
          // window.location.reload();
            const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
  localStorage.removeItem("redirectAfterLogin");
  navigate(redirectPath);
        
        }        
     
      
      } else {
        // --- Register Logic ---
        if (formData.password !== formData.confirmPassword) {
          setMessage("Error: Passwords do not match!");
          setLoading(false);
          return;
        }
        if (!formData.agreeToTerms) {
          setMessage("Error: You must agree to the terms and privacy policy!");
          setLoading(false);
          return;
        }

        await AuthService.register(
          formData.firstName + " " + formData.lastName,
          formData.email,
          formData.password
        );
        setMessage("Registration successful! Please sign in.");
        setIsLogin(true); // Switch to login mode after successful registration
      }
    } catch (error: any) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
      console.error("Auth error:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    });
    setMessage("");
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-amber-600 p-1 rounded-3xl max-w-md w-full relative animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 relative">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute top-1/4 left-1/4 text-orange-100/20 animate-pulse">
              <Star size={40} />
            </div>
            <div className="absolute bottom-1/4 right-1/4 text-orange-100/20 animate-pulse delay-1000">
              <Heart size={30} />
            </div>
            <div className="absolute top-3/4 left-1/3 text-orange-100/20 animate-pulse delay-2000">
              <Sun size={50} />
            </div>
          </div>

          {/* Logo Section */}
          <div className="text-center mb-6 relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-3 shadow-lg">
             🕉
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Sacred Store
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {isLogin
                ? "Welcome back to your spiritual journey"
                : "Begin your sacred shopping experience"}
            </p>
          </div>

          {/* Auth Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6 relative z-10">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 text-sm ${
                isLogin
                  ? "bg-white text-orange-600 shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 text-sm ${
                !isLogin
                  ? "bg-white text-orange-600 shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Name Fields (Register Only) */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top duration-300">
                <div className="relative">
  <User
  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 z-10"
  size={18}
/>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm"
                  />
                </div>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 z-10" 
                    size={18}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm"
                  />
                </div>
              </div>
            )}

        
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 z-10"
                size={18}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 z-10"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password Field (Register Only) */}
            {!isLogin && (
              <div className="relative animate-in slide-in-from-top duration-300">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 z-10"
                  size={18}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            )}

         
            {/* <div className="flex items-center justify-between text-sm">
              {isLogin ? (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
              ) : (
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-0.5"
                    required
                  />
                  <span className="ml-2 text-gray-600 text-xs">
                    I agree to the{" "}
                    <a href="#" className="text-orange-600 hover:underline">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-orange-600 hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              )}

              {isLogin && (
                <a href="#" className="text-orange-600 hover:underline">
                  Forgot password?
                </a>
              )}
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 hover:from-orange-600 hover:to-red-700"
              disabled={loading}
            >
              {loading
                ? isLogin
                  ? "Signing In..."
                  : "Registering..."
                : isLogin
                ? "Sign In to Your Account"
                : "Create Sacred Account"}
            </button>

            {/* Message Display */}
            {message && (
              <div
                className={`mt-4 p-3 rounded-md text-center text-sm ${
                  message.includes("Error:")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message}
              </div>
            )}
          </form>

          {/* Social Login */}
          <div className="mt-6 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm text-sm font-medium text-gray-500 hover:bg-gray-50 hover:shadow-md transition-all duration-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>
              <button className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm text-sm font-medium text-gray-500 hover:bg-gray-50 hover:shadow-md transition-all duration-300">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center relative z-10">
            <p className="text-sm text-gray-600">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-orange-600 hover:underline font-medium"
              >
                {isLogin ? "Sign up here" : "Sign in here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
