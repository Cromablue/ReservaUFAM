import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Tasks(props) {
      const navigate = useNavigate();
      function onSeeDetailsClick(task) {
        const query = new URLSearchParams();
        query.set('title', task.title);
        query.set('description', task.description);
        navigate(`/task?title=${task.title}&description=${task.description}`);
      } 
      return (
        <ul className="space-y-4 p-6 bg-slate-200 rounded-md shadow">
          {props.tasks.map((task) => 
          <li key={task.id} className="flex gap-2">
            <button 
              onClick={() => props.onTaskClick(task.id)} 
              className={'bg-slate-400 text-left w-full text-white p-2 rounded-md' }
              >
                {task.title}
                {task.isCompleted ? <span style={{ color: 'green' }}> (Concluido)</span> : <span style={{ color: 'red' }}> (Pendente)</span>}
            </button>
            <button onClick={() => onSeeDetailsClick(task)} className="bg-slate-400 p-2 text-white p-2 rounded-md ">
                <ChevronRightIcon/>
            </button>
            
            <button onClick={() => props.onDeleteTaskClick(task.id)} className="bg-slate-400 p-2 text-white p-2 rounded-md ">
                <TrashIcon/>
            </button>

            </li>)}
        </ul>
      )
}
    

export default Tasks;