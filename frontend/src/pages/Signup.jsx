import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mobile: "",
    pincode: "",
    name: "",
    email: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile format

    if (!mobileRegex.test(formData.mobile)) {
      return "Enter valid 10-digit mobile number";
    }

    if (!formData.pincode || formData.pincode.length < 4) {
      return "PIN must be at least 4 characters";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const res = await api.post('/signup', formData);

      setSuccess(res.data.message || "Signup successful!");

      setTimeout(() => {
        navigate("/"); // redirect to login
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ mobile: "", pincode: "", name: "", email: "" });
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-950 flex items-center justify-center p-4">
      <div className="bg-gray-800 w-full max-w-md rounded-3xl p-10 shadow-2xl border border-blue-800">
        <h2 className="text-4xl font-bold text-center text-white mb-10 tracking-widest">
          ATM Signup
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-2 mb-4 rounded text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-white text-l font-medium mb-1">
              Name (Optional)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label className="text-white text-l font-medium mb-1">
              Email (Optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="text-white text-l font-medium mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobile"
              maxLength="10"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter mobile number"
            />
          </div>

          <div className="mb-6">
            <label className="text-amber-100 text-sm font-medium mb-1">
              4-Digit PIN
            </label>
            <input
              type="password"
              name="pincode"
              maxLength="4"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter 4-digit PIN"
            />
          </div>
          
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={handleClear}
              className="bg-red-400 text-white px-4 py-2 rounded w-1/2 hover:bg-red-600 transition"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded w-1/2 hover:bg-blue-800 transition"
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>

          </div>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
