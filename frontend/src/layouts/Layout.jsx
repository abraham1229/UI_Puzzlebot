import React from 'react'
import { Outlet } from 'react-router-dom'
import { useTopicStatus } from '../hooks/connection'

export default function Layout() {

  const { conectionStatus } = useTopicStatus()

  return (
    <div className='bg-slate-950 min-h-screen text-white pt-15'>
      <div className='flex flex-col text-center lg:flex-row lg:justify-evenly lg:items-baseline'>
        <h1 className='text-3xl'> URDF Visualizer for Rviz2</h1>
        <p className='text-xl mt-5'> 
          {conectionStatus ? 
            'Conexión establecida mediante web socket' : 
            'Estableciendo conexion...'} 
          </p>
      </div>
      <div className='m-16'>
        <Outlet />
      </div>

    </div>
  )
}
