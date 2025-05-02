import axios from "axios";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isLogin){
        const response = await axios.post(import.meta.env.VITE_API_URL + '/admin/login', { email: form.email, password: form.password });
        console.log('login:',response.data);
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('name', response.data.user.name)
        localStorage.setItem('userId', response.data.user.id)
        toast.success(response.data.message)
      }else{
        const response = await axios.post(import.meta.env.VITE_API_URL + '/admin/signup', { name: form.name, email: form.email, password: form.password });
        console.log('signup:',response.data);
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('name', response.data.user.name)
        localStorage.setItem('userId', response.data.user.id)
        toast.success(response.data.message)
      } 
      navigate('/')
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        // Validation errors from backend
        console.error('Validation errors:', err.response.data.errors || {});
      } else {
        // Other (network/server) errors
        console.error('Authentication error:', err);
        toast.error('Something went wrong. Please try again.');
      }
    };
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
