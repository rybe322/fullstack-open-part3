const { response } = require('express')
const express = require('express') // import express
var morgan = require('morgan')
const cors = require('cors')

const app = express() // Creates an express application

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())


/*
MIDDLEWARE
*/
app.use('/api/persons', (req, res, next) => {
    console.log('This is a test application-level middleware', Date.now())
    console.log("request type:  ", req.method)
    next()
})

app.use('/api/persons/:id', (req, res, next) => {
    console.log("Person looked up from an application-level middleware")
    console.log("request type: ", req.method)
    next()
})

const requestLogger = (req, res, next) => {
    console.log('-------------')
    console.log('Method: ', req.method)
    console.log('Path', req.path)
    console.log('Body', req.body)
    console.log('-------------')
    next()
}

app.use(requestLogger)

/*
DUMMY JSON 
*/

let persons = [{ 
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
    }]

/*
ROUTES
*/
app.get('/', (request, response) => {
    response.send('<h3>Hello world</h3>')
})

// Fetch all persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Info page
app.get('/api/info', (request, response) => {
    const responseString =`<p>Phonebook has info for ${persons.length} people</p><p>${Date().toString()}</p>`
    response.send(responseString)
})

// Generate information for a single entry
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    console.log("You are getting",person)

    if (person) {
        response.json(person)
    }else {
        response.status(404).end()
    }
})

// Delete a single entry 
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    console.log('Hello from delete',persons)
    response.status(204).end()
})

// Add entry to phonebook
const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    console.log('body', body)
    if (!body.name) {
        return response.status(400).json({error: 'name is missing'})
    }else if(!body.number) {
        return response.status(400).json({error: 'Number cannot be missing'})
    }else if ((persons.find(p => p.name === body.name)) !== undefined) {
        return response.status(400).json({error: "Duplicate entry"})
    }
    
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person)
    response.json(person)
})

/*
MIDDLEWARE THAT RUNS AFTER ROUTES
*/
const unkownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint' })
}
app.use(unkownEndpoint)


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})