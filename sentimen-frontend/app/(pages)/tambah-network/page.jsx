"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from '@/app/lib/axios'
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function TambahNetwork() {
  // const [formData, setFormData] = useState({
  //   query: '',
  //   tanggal: '',
  //   csv: null
  // })

  const router = useRouter()

  const [query, setQuery] = useState()
  const [tanggal, setTanggal] = useState()
  const [csv, setCsv] = useState()

  const handleQueryChange = (e) => {
    setQuery(e.target.value)
  }

  const handleTanggalChange = (e) => {
    setTanggal(e.target.value)
  }

  const handleFileChange = (e) => {
    setCsv(e.target.files[0])
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formDataToSend = new FormData();
    formDataToSend.append("query", query);
    formDataToSend.append("tanggal", tanggal);
    formDataToSend.append("file", csv);

    try {
      const response = await axios.post('/network', formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Data berhasil ditambahkan!', {
        position: 'top-left',
        autoClose: 1500, // Durasi notifikasi (ms)
        onClose: () => router.back()
      });
    } catch (error) {
      console.log(error);
    }
  }

  // console.log(formDataTo);

  return (
    <div className='text-black flex items-center justify-center h-screen'>
      <ToastContainer />
      <div className='p-6 shadow-lg w-4/12 rounded-md'>
        <h1 className='text-center font-semibold'>Tambah Network</h1>
        <form action="" onSubmit={handleSubmit} encType='multipart/form-data'>
          <div className="mb-4">
            <label for="query" className="block text-gray-700 text-sm mb-2">Query</label>
            <input type="text" required id="query" name="query" onChange={handleQueryChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label for="tanggal" className="block text-gray-700 text-sm mb-2">Tanggal</label>
            <input type="date" required id="tanggal" name="tanggal" onChange={handleTanggalChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label for="csv" className="block text-gray-700 text-sm mb-2">CSV</label>
            <input type="file" required id="csv" name="file" onChange={handleFileChange} multiple className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          
          <div className="mb-4 flex justify-between">
            <Link href="/list-network" className="text-blue-500 hover:underline">Kembali ke List Network</Link>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Tambahkan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
