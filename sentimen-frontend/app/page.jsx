'use client'
import Image from 'next/image'
import Link from 'next/link'
import Header from './components/header'
import { useEffect, useState } from 'react'
import axios from './lib/axios'
import axiosFlask from './lib/axiosFlask'

export default function Home() {
  const [sentimens, setSentimens] = useState()
  const [networks, setNetworks] = useState()
  const [result, setResult] = useState()
  const textInput = document.getElementById('pesan')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sentimen = await axios.get('/sentimen'); // Ganti URL dengan endpoint yang sesuai
        const network = await axios.get('/network'); // Ganti URL dengan endpoint yang sesuai
        setSentimens(sentimen.data);
        setNetworks(network.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClear = (e) => {
    setResult(null)
    textInput.value = ''
  }

  const handlePesanChange = async (e) => {
    try {
      const response = await axiosFlask.post('/submit', {
        "text": e.target.value
      })
      setResult(response.data.data.sentimen)
      console.log(result);
      console.log(response);

    } catch (error) {
      console.log(error);
    }
  }
  console.log(sentimens);
  return (
    <main className="bg-slate-200 p-6">
      {/* <Header /> */}
      <div className='h-screen flex items-center justify-center'>
        <div>
          <div className='w-2/3 mx-auto mb-3'>
            <h1 className='font-bold mt-auto text-7xl text-center'>Sentimen Analisis dan Network Analisis</h1>
          </div>
          <p className='text-center text-lg font-medium mb-24 text-[#666]'>Syair Muharram 42619022</p>
          <p className='text-center text-blue-500'>
            <a href="#start" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>Mulai</a>
          </p>
        </div>
      </div>

      <div className='grid grid-cols-4 gap-5 pt-2' id='start'>
        <div className='p-6 bg-white shadow-md rounded-md col-span-1 h-96'>
          <div className='flex flex-row justify-between p-2 mb-4'>
            <h1 className='font-bold text-lg'>LSTM Predictor</h1>
            <button className='border-2 rounded-lg px-2 hover:border-black' onClick={handleClear}>Clear</button>
          </div>
          <div>
            <div class="mb-4">
              <textarea id="pesan" rows='5' onChange={handlePesanChange} placeholder='Masukkan pesan anda' name="pesan" class="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
            </div>
            <div className='border mb-4'></div>
            <div>
              <h1 className='font-bold text-lg mb-4'>Hasil Prediksi: </h1>
            </div>
            <div>
          <div class="mb-4">
                {result === "Positive" ? 
                    <p type="submit" class="inline-block w-full text-center mr-4 bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Positif
                  </p>
                : result === "Negative" ?
                  <p type="submit" class="inline-block w-full text-center mr-4 bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Negatif
                </p> 
                  : result === "Neutral" ? 
                  <p type="submit" class="inline-block w-full text-center mr-4 bg-slate-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Netral
                </p> 
                : null
                }
                
                
                
              </div>
            </div>
          </div>
        </div>
        <div className='col-span-3 h-auto'>
          <h1 className='mb-3 font-bold text-lg'>Sentimens</h1>
          <div className='mb-5 grid grid-cols-4 gap-3'>
            
            

            {sentimens ? sentimens.map(item => {
              return (
                <>
                    <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                      <div>
                        <div className='relative h-40'>
                          <Image 
                            src="/twitter-1.jpg"
                            fill='true'
                            alt='icon'
                            className='absolute object-cover rounded-t-md'
                          />
                        </div>
                      </div>
                      <div class="p-5">
                          <a href="#">
                              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item.query}</h5>
                          </a>
                          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{item.tanggal}</p>
                          <a href={`/sentimen/${item.id}`} class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                              Selengkapnya
                              <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                              </svg>
                          </a>
                      </div>
                  </div>
                </>
              )
            }) : <p>Loading</p>}
          </div>
          <h1 className='mb-3 font-bold text-lg'>Networks</h1>
          <div className='mb-5 grid grid-cols-4 gap-3'>

            {networks ? networks.map(item => {
            return (
              <>
                  <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                      <div>
                        <div className='relative h-40'>
                          <Image 
                            src="/twitter-1.jpg"
                            fill='true'
                            alt='icon'
                            className='absolute object-cover rounded-t-md'
                          />
                        </div>
                      </div>
                      <div class="p-5">
                          <a href="#">
                              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item.query}</h5>
                          </a>
                          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{item.tanggal}</p>
                          <a href={`/network/${item.id}`} class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                              Selengkapnya
                              <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                              </svg>
                          </a>
                      </div>
                  </div>
              </>
            )
          }) : <p>Loading</p>}
          </div>
        </div>
      </div>
    </main>
  )
}
