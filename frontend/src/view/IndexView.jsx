
export default function IndexView() {
  return (
    <div className="grid grid-cols-3 gap-10 h-[80vh]">
      <div className="border-2 rounded-xl p-10">
        <h2 className="text-2xl"> Model Selection </h2>
      </div>      
      <div className="col-span-2 rounded-xl border-2 p-10">
        <h2 className="text-2xl"> Model Information</h2>
      </div>        
    </div>
  )
}
