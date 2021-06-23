const Joi = require('joi')
const express = require('express')
const app = express()
app.use(express.json())
var cors = require('cors')

// use it before all route definitions
app.use(cors({ origin: 'http://localhost:3000' }))

const tasks = [
  { id: 1, text: 'study', reminder: true, day: 'tomorrow' },
  { id: 2, text: 'please work', reminder: false, day: 'now' },
  { id: 3, text: 'whyyyy', reminder: true, day: 'tuesday' },
]

//takes 2 arg: path, callback func/route handleer
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/tasks', (req, res) => {
  res.send(tasks)
})

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find((c) => c.id === parseInt(req.params.id))
  if (!task) res.status(404).send('this task with the given id was not found')
  res.send(task)
})

app.post('/api/tasks', (req, res) => {
  const { error } = validateTask(req.body)
  if (error) return request.status(400).send(result.error.details[0].message)
  const task = {
    id: tasks.length + 1,
    text: req.body.text,
    reminder: req.body.reminder,
    day: req.body.day,
  }
  tasks.push(task)
  res.send(task)
})

app.put('/api/tasks/:id', (req, res) => {
  //look up the task
  const task = tasks.find((c) => c.id === parseInt(req.params.id))
  //return 404 if doesn't exist
  if (!task)
    return res.status(404).send('the task with the given id was not found.')

  //validate
  //obj destructuring
  const { error } = validateTask(req.body)

  //return 400 if invalid
  if (error) return request.status(400).send(result.error.details[0].message)

  //update
  task.text = req.body.text
  task.reminder = req.body.reminder
  task.day = req.body.day

  //return
  console.log(res)
  res.send(task)
})

app.delete('/api/tasks/:id', (req, res) => {
  //look up the task
  const task = tasks.find((c) => c.id === parseInt(req.params.id))
  //return 404 if doesn't exist
  if (!task)
    return res.status(404).send('the task with the given id was not found.')
  const index = tasks.indexOf(task)
  tasks.splice(index, 1)
  res.send(tasks)
})

function validateTask(task) {
  const schema = Joi.object({
    text: Joi.string().min(3).required(),
    reminder: Joi.boolean().required(),
    day: Joi.string(),
    id: Joi.any(),
  })

  return schema.validate(task)
}

app.get('api/tasks/:id', (req, res) => {
  const task = tasks.find((c) => c.id === parseInt(req.params.id))
  if (!task)
    return res.status(404).send('the task with the given id was not found.')
  res.send(task)
})

//port - env var
const port = process.env.PORT || 5000
app.listen(port, () => console.log('listening on port ' + port))
