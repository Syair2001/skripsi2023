"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from '@/app/lib/axios'
import { useRouter } from 'next/navigation'

export default function Header(isAuth) {
  const {push} = useRouter()
  const handleLogout = async () => {
    try {
      await axios.get('/logout', {withCredentials:true})
      push('/')
      isAuth = false
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='bg-slate-300 flex justify-between border border-b-2 p-6 rounded-b-lg'>
        <div>
          <Link href='/'>
            <Image 
              src="/pnup.png"
              width={40}
              height={40}
              alt='logo'
            />
          </Link>
        </div>
        <ul className='flex justify-between font-semibold'>
          <li className='mr-7'>
            <Link href='/sentimen-analysis'>
              LSTM Predictor
            </Link>
          </li>
          <li className='mr-7'>
            <Link href='/login'>
              Login
            </Link>
          </li>
        </ul>
      </div>
  )
}
