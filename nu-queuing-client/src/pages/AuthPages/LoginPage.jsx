import { useState } from "react";
import { useNavigate } from "react-router-dom";
import nuhorilogo from "../../assets/images/nulogohorizontal-blue.jpg";
import { loginUser } from "../../services/UserService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginUser({
        email: form.email,
        password: form.password,
      });
      // Store user session in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", data.type);
      localStorage.setItem("userDepartment", data.department || "");
      localStorage.setItem("userFirstName", data.firstName || "");
      localStorage.setItem("userLastName", data.lastName || "");
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[#32418C] font-clan-ot">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] bg-[#32418C] rounded-full blur-[40px] opacity-20 -top-44 -left-44" />
        <div className="absolute w-[400px] h-[400px] bg-[#FBD117] rounded-full blur-[40px] opacity-20 -bottom-32 -right-32" />
        <div className="absolute w-[300px] h-[300px] bg-[#32418C] rounded-full blur-[40px] opacity-10 bottom-[10%] left-[10%]" />
        <div className="absolute w-[200px] h-[200px] bg-[#FBD117] rounded-full blur-[40px] opacity-10 top-[20%] right-[15%]" />
      </div>

      {/* Container */}
      <div className="relative z-10 flex w-full flex-col md:flex-row">
        {/* Left Panel */}
        <div className="flex flex-1 flex-col items-center justify-center bg-white text-[#32418C] rounded-br-[40px] rounded-tr-[40px] md:border-r-8 border-[#FBD117] shadow-lg">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <img
              src={nuhorilogo}
              alt="NU Logo"
              className="absolute top-10 left-1/2 -translate-x-1/2 w-4/5 max-w-[300px]"
            />
            <div className="text-center px-4">
              <h1 className="text-4xl font-bold mb-4 mt-20">
                Administrator Login
              </h1>
              <p className="text-lg text-gray-600">
                Please enter your credentials to access the system.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel / Form */}
        <div className="flex flex-1 items-center justify-center px-8 py-16">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[#32418C] font-semibold mb-2 text-lg"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full p-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#32418C]"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-[#32418C] font-semibold mb-2 text-lg"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className="w-full p-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#32418C]"
                />
              </div>
              {error && <div className="text-red-500 text-center">{error}</div>}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#32418C] text-white font-semibold rounded-xl hover:bg-[#273275] flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : null}
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
