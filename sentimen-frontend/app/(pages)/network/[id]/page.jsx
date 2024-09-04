"use client"
import axios from '@/app/lib/axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export default function NetworkDetail({params}) {
  const [network, setNetwork] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/network/${params.id}`)
        setNetwork(response.data)
        console.log(network);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData()
  }, [])

  if (!network) {
    return <p>Loading....</p>
  }
  return (
    <div className=''>
      <div class="text-black bg-white shadow-md rounded-b-lg py-4 px-6 fixed top-0 left-0 right-0 z-50">
        <div class="container mx-auto">
          <a href='/' class="flex justify-between items-between">
            <div class="logo text-base font-medium underline">Kembali ke halaman utama</div>
            <div class="logo text-lg font-bold">Network Result</div>
            <div class="logo text-base font-medium"></div>
          </a>
        </div>
      </div>

      <div class="container mx-auto py-8 mt-8">
        <div className=''>
          <div className='relative'>
            <Image 
              alt='result'
              src={`http://127.0.0.1:5000/static/plot/${network.NetworkResult.result1}`}
              width={800}
              height={800}
              className='mx-auto'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
