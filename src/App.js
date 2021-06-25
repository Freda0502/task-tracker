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
      .then((res) => console.log('this is res before json hahahahahaha', res))
      .then((res) => res.json())
      .then((res) => setTasks(res))
      // .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  // Toggle Reminder(put)
  const toggleReminder = (id) => {
    // console.log('toggle-reminder called', id)
    // console.log('tasks:', tasks)
    var taskToToggle //returns 'Error!'

    var result = []
    for (var i in tasks) result.push([i, tasks[i]])
    console.log('result', result)

    for (let i = 0, max = result.length; i < max; i++) {
      if (tasks[i].id === id) {
        console.log('task i', tasks[i])
        taskToToggle = tasks[i]
      }
    }
    console.log('task to toggle', taskToToggle)

    // console.log('this is the task to toggle:', taskToToggle)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
    console.log('updTask', updTask)

    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    })
      // .then('before', (res) => console.log(res))
      .then((res) => console.log('this is res before json', res))
      .then((res) => res.json())
      // .then((res) => console.log('this is res after json!!!!', res)) //this is not logged for some reason
      .then((res) => setTasks(res))
      .catch((err) => console.log(err))
  }
  console.log(tasks)

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
