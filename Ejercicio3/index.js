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


let phones =  [
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
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    const existingName = phones.find(person => person.name=== body.name)
    if (existingName) {
        return response.status(400).json({error: 'name already existing'})
    }

    const existingNumber = phones.find(person => person.number === body.number)
    if (existingNumber){
        return response.status(400).json({error: 'number already existing'})
    }
    const person =new Person({
        
        name: body.name,
        number: body.number,
        id: body.id,
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})


app.get('/',(request,response) => {
    response.send('<h1>Hello world!</h1>')
})
app.get('/info',(request,response) => {
    const time = new Date()
    const timeString = time.toString()
    response.send(`<div><p>PhoneBook has info for ${phones.length} people</p><p>${timeString}</p></div>`)
})
app.get('/api/persons',(request,response) => {
    Person.find({}).then(person  => {
        response.json(person)
    })
})
app.get('/api/persons/:id',(request,response) => {
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

app.delete('/api/persons/:id',(request,response,next) =>{
    Person.findByIdAndDelete(request.params.id)
    .then(result =>{
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id',(request,response,next)=> {
    const body = request.body
    const person ={
        name: body.name,
        number : body.number
    }
    Person.findByIdAndUpdate(request.params.id,person,{new : true}).then(updatedPerson => {response.json(updatedPerson)})
    .catch(error => next(error))
})


const PORT = process.env.PORT || 3002
app.listen(PORT,() => {
    console.log(`Server listening on ${PORT}`)
})