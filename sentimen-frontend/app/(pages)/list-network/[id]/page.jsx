"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from '@/app/lib/axios'
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function EditNetwork({params}) {
  // const [formData, setFormData] = useState({
  //   query: '',
  //   tanggal: '',
  //   csv: null
  // })

  const router = useRouter()

  const [query, setQuery] = useState()
  const [tanggal, setTanggal] = useState()

  const handleQueryChange = (e) => {
    setQuery(e.target.value)
  }

  const handleTanggalChange = (e) => {
    setTanggal(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formDataToSend = new FormData();
    formDataToSend.append("query", query);
    formDataToSend.append("tanggal", tanggal);

    try {
      const response = await axios.put(`/list-network/${params.id}`, formDataToSend)
      toast.success('Data berhasil ditambahkan!', {
        position: 'top-left',
        autoClose: 1500, // Durasi notifikasi (ms)
        onClose: () => router.back()
      });
    } catch (error) {
      console.log(error);
    }
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(`/network/${params.id}`, {withCredentials: true})
      const date = new Date(response.data.tanggal)
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      setQuery(response.data.query)
      setTanggal(`${yyyy}-${mm}-${dd}`)
    } catch (error) {
      console.log(error);
      toast.error('Data gagal ditemukan!', {
        position: 'top-left',
        autoClose: 1500, // Durasi notifikasi (ms)
        onClose: () => router.back()
      });
    }
  }

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className='text-black flex items-center justify-center h-screen'>
      <ToastContainer />
      <div className='p-6 shadow-lg w-4/12 rounded-md'>
        <h1 className='text-center font-semibold'>Edit Network</h1>
        <form action="" onSubmit={handleSubmit} encType='multipart/form-data'>
          <div className="mb-4">
            <label for="query" className="block text-gray-700 text-sm mb-2">Query</label>
            <input type="text" value={query} required id="query" name="query" onChange={handleQueryChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label for="tanggal" className="block text-gray-700 text-sm mb-2">Tanggal</label>
            <input type="date" value={tanggal} required id="tanggal" name="tanggal" onChange={handleTanggalChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          
          <div className="mb-4 flex justify-between">
            <Link href="/list-network" className="text-blue-500 hover:underline">Kembali ke List Network</Link>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
