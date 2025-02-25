import { use } from "react";
import AddTasks from "./components/AddTasks"
import Tasks from "./components/Tasks"
import { useEffect,useState } from 'react';

function App() {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  
  },[tasks])

  function onTaskClick(taskId) {
    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {...task, isCompleted: !task.isCompleted};
        
      }
      return task;
    })
    setTasks(newTasks);
  }

function onDeleteTaskClick(taskId) {
  const newTasks = tasks.filter((task) => task.id !== taskId)
  setTasks(newTasks)
}

function onAddTaskSubmite(title, description) {
  const newTask = {
    id: tasks.length + 1,
    title: title,
    description: description,
    itsCompleted: false,
  }
  setTasks([...tasks, newTask])
}

  return (
    <div className="w-screen h-screen bg-slate-500 flex justify-center p-6">
      <div className="w-[500px] space-y-4">
        <h1 className="text-3xl text-slate-100 front-bold text-center">
          Reservas da Ufam
        </h1>
        <AddTasks onAddTaskSubmite={onAddTaskSubmite} />
        <Tasks tasks={tasks} onTaskClick={onTaskClick} onDeleteTaskClick={onDeleteTaskClick}/>
        
      </div>
    </div>
  )
}
export default App


