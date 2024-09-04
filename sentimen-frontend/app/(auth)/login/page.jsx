'use client'
import axios from '@/app/lib/axios'
import { headers } from '@/next.config'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function Login() {
  const {push} = useRouter()
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const handleUsername = (e) => {
    setUsername(e.target.value)
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      username: username,
      password: password,
    };

    try {
      const { data } = await axios.post("/login", payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        },
      });

      alert(JSON.stringify(data));

      // redirect the user to /dashboard
      push("/list-sentimen");
    } catch (e) {
      // const error = e as AxiosError;

      alert(e.message);
    }
  };

  return (
    <div className='text-black flex items-center justify-center h-screen'>
      <div className='p-6 shadow-lg w-4/12 rounded-md'>
        <h1 className='text-center font-semibold'>Login</h1>
        <form action="" onSubmit={handleSubmit}>
          <div class="mb-4">
            <label for="username" class="block text-gray-700 text-sm mb-2">Username</label>
            <input type="text" onChange={handleUsername} id="username" name="username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-gray-700 text-sm mb-2">Password</label>
            <input type="password" onChange={handlePassword} id="password" name="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          
          <div class="mb-4 flex justify-between">
            <Link href="/" class="text-blue-500 hover:underline">Kembali ke Beranda</Link>
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
