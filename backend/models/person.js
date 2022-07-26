const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(response => {
    console.log('connected to mongodb')
    })
  .catch(err => {
    console.log('Error connecting to mongodb:  ', err.message)
  })

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 2,
      required: true
    },
    number: {
      type: String,
      minLength: 5,
      required: true
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)