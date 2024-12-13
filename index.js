const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(express.static('dist'))

app.use(express.json())

morgan.token('body', (req) => {
  return req.body ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())

let contacts = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(contacts)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const contact = contacts.find(contact => contact.id === id)
  if (contact){
    response.json(contact)
  }else{
    response.status(404).end()
  }
})

app.get('/api/info', (request, response) =>{
  const contactsCount = contacts.length
  const currentdate = new Date(); 
  const datetime = currentdate.toLocaleString('en-us', {weekday:'short'}) + " " 
                  + currentdate.toLocaleString('en-us', {month:'short'}) + " " 
                  + currentdate.getDate() + " "
                  + currentdate.getFullYear() + " "  
                  + currentdate.getHours() + ":"  
                  + currentdate.getMinutes() + ":" 
                  + currentdate.getSeconds()+ " "
                  + currentdate.toTimeString().slice(9)
  response.send(`<p>Phonebook has info for ${contactsCount} people</p><p>${datetime}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  contacts = contacts.filter(contact => contact.id !== id)

  response.status(204).end()
})

const getRandomInt = () => {
  return Math.floor(Math.random() * 10000).toString();
}

const checkUniqueName = (name) => {
  return contacts.find(contact => contact.name === name)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number){
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  if (checkUniqueName(body.name)){
    return response.status(400).json({
      error: 'name currently in use'
    })
  }

  const contact = {
    id: getRandomInt(),
    name: body.name,
    number: body.number
  }
  
  contacts = contacts.concat(contact)

  response.json(contact)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})