const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the passwrod as an argument')
    process.exit(1)
}

const password = process.argv[2]

const newName = process.argv[3] || ''
const newNumber = process.argv[4] || ''


console.log('LENGTH OF ARGV:', process.argv.length)

const url = `mongodb+srv://part3database:${password}@cluster0.znjlgen.mongodb.net/PhonebookDatabase?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length > 3){
    mongoose
    .connect(url)
    .then(response => {
        console.log('connected')

        const person = new Person({
            name: newName,
            number: newNumber,
        })
        return person.save()
        })
    .then(() => {
        console.log(`${newName} ${newNumber} was added to phonebook`)
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
} else {
    mongoose
    .connect(url)
    .then(response => {
        console.log('connected')
        Person.find({}).then(persons => {
            console.log('-------PHONEBOOK-------')
            persons.forEach(person => {
                console.log(`${person.name}:  ${person.number}`)
            })
            return mongoose.connection.close()
        })
    })
    .catch((err) => console.log(err))
}

        
