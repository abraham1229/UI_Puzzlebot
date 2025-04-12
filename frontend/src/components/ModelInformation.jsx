import { useTopicValue } from "../hooks/topic"


export default function ModelInformation() {
  const {value} = useTopicValue()
  return (
    <>
      <h2 className="text-2xl"> Model Information</h2>
      {value}
    
    </>
  )
}
