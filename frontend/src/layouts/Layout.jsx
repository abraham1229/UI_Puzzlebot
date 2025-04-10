import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className='bg-slate-950 min-h-screen text-white pt-15'>
      <div className='flex justify-evenly items-baseline'>
        <h1 className='text-3xl'> URDF Visualizer for Rviz2</h1>
        <p className='text-xl'> Conexion establecida </p>
      </div>
      <div className='m-16'>
        <Outlet />
      </div>
      
    </div>
  )
}
