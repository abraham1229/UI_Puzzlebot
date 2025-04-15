import React, { useEffect, useRef, useState } from 'react'
import * as ROSLIB from 'roslib'
import { useTopicValue } from '../hooks/topic'
import { useTopicStatus } from '../hooks/connection'

export default function PublisherComponent() {

  //Valores de zustand
  const { setValue } = useTopicValue()
  const { setTopicState} = useTopicStatus()

  //Vars ros conextion
  const [status, setStatus] = useState(false)
  const ros = new ROSLIB.Ros({ encoding: 'ascii' })
  const cmdVel = new ROSLIB.Topic({
    ros: ros,
    name: 'int_topic',
    messageType: 'std_msgs/Int32'
  })


  //Valores a publicar
  const [number, setNumber] = useState({ data: 1 })
  const numberRef = useRef(number);

  //Ros functions
  const connect = () => {
    ros.connect('ws://localhost:9090')
    // won't let the user connect more than once
    ros.on('error', function (error) {
      console.log(error)
      setStatus(false)
      setTopicState(false)
    })

    // Find out exactly when we made a connection.
    ros.on('connection', function () {
      setStatus(true)
      setTopicState(true)
    })

    ros.on('close', function () {
      ros.close()
      setStatus(false)
      setTopicState(false)
    })
  }

  const publish = (newValue) => {

    if (!status) connect()

    const data = {
      data: newValue.data,
    }

    // publishes to the queue
    cmdVel.publish(data)
  }

  const handleChange = (event) => {
    const inputValue = parseInt(event.target.value, 10) || 0;
    setNumber((prev) => ({
      ...prev,
      data: inputValue
    }))
  }

  const handleClickButton = () => {

    numberRef.current = number;
  }

  useEffect(() => {
    setValue(number.data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  useEffect(() => {

    const interval = setInterval(() => {
      publish(numberRef.current)

    }, 1000)

    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='flex flex-col h-7/8'>
      <label className='text-lg' htmlFor='modelSelect'>Seleccione el modelo deseado</label>
      <select
        id='modelSelect'
        className='bg-white text-black mt-6 max-w-3/4 px-5 py-2 rounded-2xl shadow-2xl'
        value={number.data}
        onChange={handleChange}
      >
        <option value={1} className='rounded-2xl'> Modelo de Puzzlebot </option>
        <option value={2} className='rounded-2xl'> Modelo de Puzzledrone </option>
      </select>

      <p className='my-10 text-lg mx-2'>Representación del modelo</p>
      <div className='flex items-center'>
        <img
          src={`/modelviews/${number.data}.png`}
          alt={`Modelo ${number.data}`}
          className='rounded-2xl object-contain items-center w-7/8'
        />
      </div>
      
      <div className='mt-auto pt-6 flex justify-center'>
      <button 
        disabled={!status}
        className={`bg-white text-black rounded-3xl px-6 py-3 shadow-lg transition-all duration-200 
          ${!status 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-gray-500 hover:text-white active:scale-95'}`}
        onClick={handleClickButton}
      >
        Select
      </button>

    </div>

    </div>
  )
}
