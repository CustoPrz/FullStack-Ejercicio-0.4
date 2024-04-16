const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

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
    const person = {
        
        name: body.name,
        number: body.number,
        id: body.id,
    }
    phones = phones.concat(person)
    response.json(person)
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
    response.json(phones)
})
app.get('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = phones.find(person => person.id === id)
    if (person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})
app.delete('/api/persons/:id',(request,response) =>{
    const id =Number(request.params.id)
    phones = phones.filter(person => person.id !== id)

    response.status(204).end()
})


const PORT = process.env.PORT || 3002
app.listen(PORT,() => {
    console.log(`Server listening on ${PORT}`)
})