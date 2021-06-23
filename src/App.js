import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'
// // import useFetch from 'react-fetch-hook'
// import { useRequest } from 'ahooks'
// import axios from 'axios'

// mongoose
// const mongoose = require('mongoose')

// mongoose.connect(
//   'mongodb+srv://freda:Zxy570020793@cluster0.fcems.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
//   {
//     useMongoClient: true,
//   }
// )

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  //fetch the data
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks/')
      .then((response) => response.json())
      .then((data) => setTasks(data))
  }, [])

  // Add Task
  const addTask = (task) => {
    console.log(
      JSON.stringify({
        id: task.id,
        text: task.text,
        reminder: task.reminder,
        day: task.day,
      })
    )
    fetch('http://localhost:5000/api/tasks/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: task.id,
        text: task.text,
        reminder: task.reminder,
        day: task.day,
      }),
    })
      .then((res) => res.json())
      // .then((res) => console.log(res))
      .then((data) => setTasks([...tasks, data]))
      .catch((err) => console.log(err))
  }

  // Delete Task
  const deleteTask = async (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => setTasks(res))
      // .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  // Fetch Task
  const fetchTask = (id) => {
    // const res = await fetch(`http://localhost:5000/api/tasks/${id}`)
    for (var i = 0, max = tasks.length; i < max; i++) {
      // Do something with the element here
      if (i === id) {
        return tasks[i]
      }
    }
    return 'Error!'
  }

  // Toggle Reminder(put)
  const toggleReminder = (id) => {
    const taskToToggle = fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

    const res = fetch(`http://localhost:5000/api/tasks${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    })
      .then((res) => res.json())
      .then((res) => setTasks(res))
      .catch((err) => console.log(err))

    console.log(res)
    const data = res.json()

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    )
  }

  return (
    <Router>
      <div className='container'>
        <Header
          title='task-tracker'
          onAdd={() => setShowAddTask(!showAddTask)}
        />
        {showAddTask && <AddTask onAdd={addTask} />}
        {tasks.length > 0 ? (
          <Tasks
            tasks={tasks}
            onDelete={deleteTask}
            onToggle={toggleReminder}
          />
        ) : (
          'no task added'
        )}

        <Router
          path='/'
          exact
          render={(props) => (
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? (
                <Tasks
                  tasks={tasks}
                  onDelete={deleteTask}
                  onToggle={toggleReminder}
                />
              ) : (
                'No Tasks To Show'
              )}
            </>
          )}
        />
        <Route path='/about' component={About} />
        <Footer />
      </div>
    </Router>
  )
}

export default App
