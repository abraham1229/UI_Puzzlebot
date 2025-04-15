import { useTopicValue } from "../hooks/topic"


export default function ModelInformation() {
  const {value} = useTopicValue()
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl text-center"> Tree Structure</h2>

      <div className="flex flex-1 items-center justify-center">
        <img 
          src={`/frames/${value}.png`}
          className="justify-center items-center object-contain"
        />
    
      </div>
    </div>
  )
}
