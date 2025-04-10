import React, { useEffect, useRef, useState } from 'react'
import * as ROSLIB from 'roslib'
import { useTopicValue } from '../hooks/topic'


export default function PublisherComponent() {

  //Valores de zustand
  const {setValue} = useTopicValue()
  
  //Vars ros conextion
  const [status, setStatus] = useState(false)
  const ros = new ROSLIB.Ros({encoding: 'ascii'})
  const cmdVel = new ROSLIB.Topic({
    ros: ros,
    name: 'int_topic',
    messageType: 'std_msgs/Int32'
  })
  
  
  //Valores a publicar
  const [number, setNumber] = useState({data: 1})
  const numberRef = useRef(number);

  //Ros functions
  const connect = () => {
      ros.connect('ws://localhost:9090')
      // won't let the user connect more than once
      ros.on('error', function (error) {
        console.log(error)
        setStatus(false)
      })
  
      // Find out exactly when we made a connection.
      ros.on('connection', function () {
        console.log('Connected!')
        setStatus(true)
      })
  
      ros.on('close', function () {
        console.log('Connection closed')
        ros.close()
        setStatus(false)
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

  useEffect(() => {
    numberRef.current = number;
    setValue(number)

// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  useEffect(() =>{
    
    const interval = setInterval(() =>{
      publish(numberRef.current)

    }, 1000)

    return () => {
      clearInterval(interval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div className='flex flex-col'>
      <label className='text-lg ' htmlFor='numberInput'>Seleccione el modelo deseado</label>
      <input 
        className='bg-white text-black mt-6 max-w-3/4 px-5 py-2 rounded-2xl'
        type='number'
        id='numberInput'
        value={number.data}
        onChange={handleChange}/>
    </div>
  )
}
