import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";

const ForgetPass: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sentOtp, setSentOtp] = useState<string>('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }
    setMessage('');
  
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_SERVERHOST + '/fetch_email',
        { email }
      );
  
      if (response.data.success) {

        const otp = response.data.otp;
        if (otp) {
          setSentOtp(otp); 
          setMessage('Email found! Please proceed to OTP.');
          setStep('otp');
        } else {
          setMessage('Failed to retrieve OTP from the response.');
        }
      } else {
        setMessage(response.data.message); 
      }
    } catch (error) {
      console.error('Error fetching email:', error);
      setMessage('An error occurred while checking the email.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(0, 1);
    setOtp(updatedOtp);

    // Auto-focus to the next input
    if (value && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus();
    }
  };


  useEffect(() => {
    if (otp.every(digit => digit !== '')) {
      handleSubmitOtp(new Event('submit'));
    }
  }, [otp]);

  const handleSubmitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some((digit) => !digit)) {
      setMessage('Please enter all OTP digits.');
      return;
    }


    const enteredOtp = otp.join('');
    if (enteredOtp === sentOtp) {
      setMessage('');
      setStep('newPassword');
    } else {
      setMessage('Incorrect OTP. Please try again.');
    }
  };

  const handleSubmitNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setMessage('Please enter both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    setMessage('Password successfully reset!');
  };

  return (
    <div className="forget-pass-container w-full max-w-md mx-auto p-2 bg-white rounded-lg">
      {step === 'email' ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-2">Forgot Password</h2>
          <p className="text-gray-500 mb-3">
            To reset your password, submit your email address below. If we can
            find you in the database, an OTP will be sent to your email address,
            with instructions how to get access again.
          </p>
          <form onSubmit={handleSubmitEmail}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-red-800 text-white font-semibold rounded-lg shadow hover:bg-red-500 transition"
              >
                Submit
              </button>
            </div>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
          )}
        </>
      ) : step === 'otp' ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-6">
            Enter the OTP sent to your email
          </h2>
          <form onSubmit={handleSubmitOtp}>
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  maxLength={1}
                  ref={(el) => (otpRefs.current[index] = el)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ))}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 bg-red-800 text-white font-semibold rounded-lg shadow hover:bg-red-500 transition"
              >
                Submit
              </button>
            </div>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
          )}
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-center mb-6">Create New Password</h2>
          <form onSubmit={handleSubmitNewPassword}>
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-red-800 text-white font-semibold rounded-lg shadow hover:bg-red-500 transition"
              >
                Submit
              </button>
            </div>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
          )}
        </>
      )}
    </div>
  );
};

export default ForgetPass;
