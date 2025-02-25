import { useNavigate,useSearchParams } from "react-router-dom"
import { ChevronLeftIcon } from "lucide-react";

function TaskPage() {
        const navigate = useNavigate();
        const [searchParams] = useSearchParams();
        const title = searchParams.get('title');
        const description = searchParams.get('description');
    return <div className="h-screen w-screen bg-slate-500 p-6">
        

        <div className="w-[500px] space-y-4">
        <div className="flex justify-center relative">
            <button onClick={() => navigate('/')} className="absolute left-0 top-0 bottom-0 text-slate-100">
                <ChevronLeftIcon/>
            </button>
        <h1 className="text-3xl text-slate-100 front-bold text-center">
          Detalhes da Reserva
        </h1>
        </div> 
        <div className="bg-slate-200 p-4 rounded-md">
            <h2 className="text-xl front-bold text-slate-600">{title}</h2>
            <p className="text-slate-600">{description}</p>
        </div>
        
      </div>


    </div>
    
}

export default TaskPage