"use client"
import axios from '@/app/lib/axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export default function SentimenDetail({params}) {
  const [sentimen, setSentimen] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/sentimen/${params.id}`)
        setSentimen(response.data)
        console.log(sentimen);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData()
  }, [])

  if (!sentimen) {
    return <p>Loading....</p>
  }
  return (
      <div className=''>
        <div class="text-black bg-white shadow-md rounded-b-lg py-4 px-6 fixed top-0 left-0 right-0 z-50">
          <div class="container mx-auto">
            <a href='/' class="flex justify-between items-between">
              <div class="logo text-base font-medium underline">Kembali ke halaman utama</div>
              <div class="logo text-lg font-bold">Sentimen Result</div>
              <div class="logo text-base font-medium"></div>
            </a>
          </div>
        </div>

        <div class="container mx-auto py-8 mt-8">
          <div className=''>
            <div className='relative'>
              <Image 
                alt='result'
                src={`http://127.0.0.1:5000/static/plot/${sentimen.SentimenResult.result2}`}
                width={800}
                height={800}
                className='mx-auto'
              />
            </div>
          </div>
        </div>
        <div class="container mx-auto py-8 mt-8">
          <div className=''>
            <div className='relative'>
              <Image 
                alt='result'
                src={`http://127.0.0.1:5000/static/plot/${sentimen.SentimenResult.result3}`}
                width={800}
                height={800}
                className='mx-auto'
              />
            </div>
          </div>
        </div>
        <div class="container mx-auto py-8 mt-8">
          <div className=''>
            <div className='relative'>
              <Image 
                alt='result'
                src={`http://127.0.0.1:5000/static/plot/${sentimen.SentimenResult.result4}`}
                width={800}
                height={800}
                className='mx-auto'
              />
            </div>
          </div>
        </div>

        {/* <div>
          <div className='mx-auto mb-8 bg-slate-300 p-4 fixed top-0 w-full'>
            <h1 className='font-bold inline-block text-4xl'>Sentimen Result</h1>
          </div>
        </div>
        <div className=''>
          <div className='relative'>
            <Image 
              alt='result'
              src={`http://127.0.0.1:5000/static/plot/${sentimen.SentimenResult.result2}`}
              width={800}
              height={800}
              className='mx-auto'
            />
          </div>
        </div> */}
        {/* <div className='bg-blue'>
          <Image 
            alt='result'
            src={`http://127.0.0.1:5000/static/plot/${sentimen.SentimenResult.result1}`}
            width={800}
            height={800}
            className='mx-auto'
          />
          <p>asdaso</p>
        </div> */}
        
      </div>
  )
}
