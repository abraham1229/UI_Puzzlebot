import { useTopicValue } from "../hooks/topic"


export default function ModelInformation() {
  const {value} = useTopicValue()
  return (
    <>
      <h2 className="text-2xl mb-10"> Tf tree</h2>

      <img src={`/frames/${value}.png`}/>
    
    </>
  )
}
