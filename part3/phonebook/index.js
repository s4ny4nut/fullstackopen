const express = require("express");
const morgan = require('morgan')
const cors = require('cors')



const app = express();

app.use(cors())
app.use(express.json());

morgan.token('body', function(request, response) {
  return JSON.stringify(request.body)
})
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))


let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

app.get("/", (request, response) => {
  response.send("<h1>Persons</h1>")
})


app.get("/info", (request, response) => {
  const personsLength = persons.length;
  const date = new Date();
  response.send(
    `
      <p>Phonebook has info for ${personsLength} people</p>
      <p>${date}</p>
    `
  )
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(item => item.id === id);

  if(person) {
    response.json(person)
  } else {
    response.status(404).end();
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id)

  response.status(204).end();
})

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const isNameExists = persons.some(person => person.name === body.name);
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing!'
    })
  } else if(isNameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  persons = persons.concat(person);
  response.json(person)

})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});