import { useState, ChangeEvent, FormEvent } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      // Call login API here
      console.log("Logging in:", form);
    } else {
      // Call signup API here
      console.log("Signing up:", form);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/10 bg-opacity-60 pointer-events-none" />
      <div className="bg-black p-10 rounded w-[90%] max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? "Admin Login" : "Admin Signup"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Director Name"
              value={form.name}
              onChange={handleChange}
              className="bg-zinc-700 p-3 rounded outline-none focus:ring-2 focus:ring-red-500"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="bg-zinc-700 p-3 rounded outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="bg-zinc-700 p-3 rounded outline-none focus:ring-2 focus:ring-red-500"
          />
          <button className="bg-red-600 hover:bg-red-700 transition p-3 rounded font-semibold">
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <div className="mt-6 text-sm text-zinc-400 text-center ">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-white underline cursor-pointer"
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
