require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))

app.use(express.json())
// app.use((request,response,next) => {
//     if (request.method === 'POST') {
//         console.log('Datos de peersonas agregado:',request.body.name)
//     }
//     next()
// }) 
morgan.token('postData', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :postData'))


app.post('/api/persons', (request, response,next) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    Person.findOne({ name: body.name }).then(existingName => {
        if (existingName) {
            return response.status(400).json({ error: 'name already existing' })
        }
        return Person.findOne({ number: body.number })
    })
        .then(existingNumber => {
            if (existingNumber) {
                return response.status(400).json({ error: 'number already existing' })
            }
            const person = new Person({

                name: body.name,
                number: body.number,
                id: body.id,
            })
            return person.save()
        })
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})


app.get('/', (request, response) => {
    response.send('<h1>Hello world!</h1>')
})
app.get('/info', async (request, response) => {
    try {
        const count = await Person.countDocuments({})
        const timeString = new Date().toString()
        response.send(`<div><p>PhoneBook has info for ${count} people</p><p>${timeString}</p></div>`)
    } catch (error) {
        console.error('Error counting documents:', error)
        response.status(500).send('Internal Server Error')
    }
})
app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true }).then(updatedPerson => { response.json(updatedPerson) })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  app.use(unknownEndpoint)
  app.use(errorHandler)


const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})