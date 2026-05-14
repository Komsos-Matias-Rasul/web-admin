'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Kredensial tidak valid");
        return;
      }

      
      



      
      router.push("/admin/editions");
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan pada server. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-primary flex-col gap-5">
      <img
              src="/top-logo.svg"
              alt="Logo Paroki"
              width={196}
              height={196}
              className="drop-shadow-xl"
            />
      <div className="w-full max-w-md bg-[#fff] rounded-2xl shadow-lg p-8  border-astra-red">
        
        <h2 className="text-2xl font-semibold text-center text-astra-dark-gray">
          Login Editor Admin
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-astra-dark-gray">
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Masukkan email"
              className="mt-1 w-full px-4 py-2 border border-astra-gray rounded-lg shadow-sm focus:border-astra-blue focus:ring focus:ring-astra-world-3 outline-none disabled:opacity-50 disabled:bg-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-astra-dark-gray">
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Masukkan password"
              className="mt-1 w-full px-4 py-2 border border-astra-gray rounded-lg shadow-sm focus:border-astra-blue focus:ring focus:ring-astra-world-3 outline-none disabled:opacity-50 disabled:bg-gray-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {errorMessage && (
            <div className="text-sm font-medium text-red-500">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-black text-white py-2 rounded-lg font-medium hover:bg-astra-dark-gray transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Memproses..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}