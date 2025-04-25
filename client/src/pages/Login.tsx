const Login = () => {
    return (
      <div className="h-screen w-full relative overflow-hidden">
        {/* Background Image */}
  
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10 bg-opacity-60" />
  
        {/* Login Form */}
        <div className="relative z-10 flex justify-center items-center h-full">
          <div className="bg-black bg-opacity-75 p-10 rounded-md w-[90%] max-w-md text-white">
            <h2 className="text-3xl font-bold mb-6">Sign In</h2>
  
            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email or phone number"
                className="bg-zinc-800 p-3 rounded outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="bg-zinc-800 p-3 rounded outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="bg-red-600 hover:bg-red-700 transition-colors p-3 rounded font-semibold">
                Sign In
              </button>
            </form>
  
            <div className="flex justify-between items-center mt-4 text-sm text-zinc-400">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-red-600" />
                Remember me
              </label>
              <span className="hover:underline cursor-pointer">Need help?</span>
            </div>
  
            <div className="mt-8 text-sm text-zinc-400">
              New to Vstream?{" "}
              <span className="text-white hover:underline cursor-pointer">
                Sign up now
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Login;
  