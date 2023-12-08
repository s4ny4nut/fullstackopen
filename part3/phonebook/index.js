require('dotenv').config()
const express = require("express")
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express();

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

morgan.token('body', function(request, response) {
  return JSON.stringify(request.body)
})

app.use(cors())
app.use(express.json());
app.use(requestLogger)
app.use(express.static('dist'))
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {    
    return response.status(400).json({ error: error.message })  
  } else {
    return response.status(500).json({ error: 'internal server error' })
  }
}


app.get("/info", (request, response, next) => {
  const date = new Date();

  Person.find({})
    .then(person => {
      response.send(
        `
          <p>Phonebook has info for ${person.length} people</p>
          <p>${date}</p>
        `
      )
    })
    .catch(error => next(error))
})

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then(person => {
    if(person) {
      response.json(person)
    } else {
      response.status(404).end();
    }
  })
  .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body
  const {name, number} = body

  const person = new Person({
    name: body.name,
    number: body.number
  })
  Person.findOne({name})
    .then(item => {
      if(!item) {
        person.save()
          .then(savedPerson => {
            response.json(savedPerson.toJSON())
          })
          .catch(error => next(error))
      } else {
        Person.findByIdAndUpdate(item.id, {number}, {new: true})
        .then(updatedItem => {
          response.json(updatedItem)
        })
        .catch(error => next(error))
      }
    })
    .catch(error => next(error))
})

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then(items => {
      response.json(items)
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true})
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
