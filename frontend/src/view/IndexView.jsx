import ModelInformation from "../components/ModelInformation";
import ModelSelection from "../components/ModelSelection";

export default function IndexView() {
  return (
    <div className="grid grid-cols-3 gap-10 h-[80vh]">
      <div className="border-2 rounded-xl p-10">
        <ModelSelection/>
      </div>      
      <div className="col-span-2 rounded-xl border-2 p-10">
        <ModelInformation/>
      </div>        
    </div>
  )
}
