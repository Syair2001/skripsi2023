"use client"
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/app/components/adminHeader'
import axios from '@/app/lib/axios'
import { useRouter } from 'next/navigation';

export default function ListNetwork() {
  const [networks, setNetworks] = useState()
  const [isAuth, setIsAuth] = useState(false)
  // const { user } = useAuth();
  const {push} = useRouter();

  const fetchData = async () => {
      try {
        const {data} = await axios.get('/list-network', {withCredentials: true})
        setNetworks(data);
        setIsAuth(true)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleHapus = async (id) => {
      try {
        if (confirm("Anda yakin ingin menghapus network?")) {
          const response = await axios.delete(`/network/${id}`, {withCredentials: true}); // Ganti URL dengan endpoint yang sesuai
          toast.success('Data berhasil dihapus!', {
            position: 'top-left',
            autoClose: 1500, // Durasi notifikasi (ms)
          });
          fetchData();
        }else{
          return null
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  }

  return (
    <div className='text-black'>
      <Header isAuth={isAuth} />
      <div className="container mx-auto p-5">
        <ToastContainer />
        <Link href='/tambah-network' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 inline-block rounded focus:outline-none focus:shadow-outline">
          Tambah Data
        </Link>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Query</th>
              <th className="py-2 px-4 border">Tanggal</th>
              <th className="py-2 px-4 border">CSV</th>
              <th className="py-2 px-4 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {networks ? 
              networks.map(item => {
                return (
                  <>
                    <tr>
                      <td className="py-2 px-4 border">{item.query}</td>
                      <td className="py-2 px-4 border">{item.tanggal}</td>
                      <td className="py-2 px-4 border">{item.csv}</td>
                      <td className="py-2 px-4 border">
                        <Link href={`/list-network/${item.id}`} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 mr-2 rounded focus:outline-none focus:shadow-outline">Edit</Link>
                        <Link href='#' onClick={() => {handleHapus(item.id)}} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">Hapus</Link>
                      </td>
                    </tr>
                  </>
                )
              })
            : <tr>
                <td>Loading...</td>
              </tr>}
          </tbody>
        </table>
      </div>

    </div>
  )
}
