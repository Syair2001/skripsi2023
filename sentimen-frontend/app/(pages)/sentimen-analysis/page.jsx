"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/app/components/header'
import axios from '@/app/lib/axiosFlask'

export default function SentimenAnalysis() {
  const [pesan, setPesan] = useState()
  const [result, setResult] = useState()

  const handlePesanChange = async (e) => {
    try {
      const response = await axios.post('/submit', {
        "text": e.target.value
      })
      setResult(response.data.data.sentimen)
      console.log(result);
      console.log(response);

    } catch (error) {
      console.log(error);
    }
  }
  console.log(pesan);
  return (
    <div>
      <Header />
      <div class="container mx-auto p-6">
        {/* <form  method='POST'> */}
          <div class="mb-4">
            <label for="pesan" class="block text-gray-700 text-sm font-bold mb-2">Pesan:</label>
            <textarea id="pesan" onChange={handlePesanChange} rows='10' name="pesan" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
          </div>
          {/* <div class="mb-4">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Kirim
            </button>
          </div> */}
        {/* </form> */}
        <div>
          <div class="mb-4">
            <p for="pesan" class="block text-gray-700 text-sm font-bold mb-2">Hasil:</p>
            {result === "Positive" ? 
                <p type="submit" class="inline-block mr-4 bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Positif
              </p>
            : result === "Negative" ?
              <p type="submit" class="inline-block mr-4 bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Negatif
            </p> 
              : result === "Neutral" ? 
              <p type="submit" class="inline-block mr-4 bg-slate-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Netral
            </p> 
            : null
            }
            
            
            
          </div>
        </div>
      </div>

    </div>
  )
}
