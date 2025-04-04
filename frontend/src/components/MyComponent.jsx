import React, { useEffect, useRef, useState } from 'react'
import * as ROSLIB from 'roslib'


export default function MyComponent() {
  
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
  }, [number]);

  useEffect(() =>{
    

    const interval = setInterval(() =>{
      console.log(numberRef.current)
      publish(numberRef.current)

    }, 1000)

    return () => {
      clearInterval(interval)
      console.log('hols')
    }

  },[])

  return (
    <div>
      <label htmlFor='numberInput'>Valor del numero</label>
      <input 
        type='number'
        id='numberInput'
        value={number.data}
        onChange={handleChange}/>
      <h1 class='font-bold text-5xl'>Hola</h1>
    </div>
  )
}
