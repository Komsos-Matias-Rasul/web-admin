'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

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
        setErrorMessage(data.error || "Login failed");
        return;
      }

      // plis lahh
      router.push("/admin/editions");
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-astra-light-gray">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border-t-8 border-astra-red">
        <h2 className="text-2xl font-semibold text-center text-astra-dark-gray">
          Login
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
              className="mt-1 w-full px-4 py-2 border border-astra-gray rounded-lg shadow-sm focus:border-astra-blue focus:ring focus:ring-astra-world-3 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="mt-1 w-full px-4 py-2 border border-astra-gray rounded-lg shadow-sm focus:border-astra-blue focus:ring focus:ring-astra-world-3 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage && (
            <div className="text-sm font-medium text-destructive">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-black text-white py-2 rounded-lg font-medium hover:bg-astra-dark-gray transition duration-200"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
