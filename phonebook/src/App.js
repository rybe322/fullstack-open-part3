import { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'
import { getSuggestedQuery } from '@testing-library/react'


const Filter = ({newNameSearch, handleNewNameSearchChange}) => {
  return(
    <div>
    filter shown with: <input
                        value={newNameSearch}
                        onChange={handleNewNameSearchChange}
                        />
    </div>
  )
}

const PersonForm = ({addEntry, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return(
    <form onSubmit={addEntry}>
    <div>
      name: <input 
              value={newName}
              onChange={handleNameChange}                
            />
      number: <input 
              value={newNumber}
              onChange={handleNumberChange}
              />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
    </form>
  )
}

const Persons = ({ persons, handleDelete}) => {
  return(
    <ul>
      {persons.map(person => <li key={person.name}>{person.name}:  {person.number} <button onClick = {() => handleDelete(person.id)}>delete {person.id}</button></li>)}
    </ul>
  )
}

const Notification =( { message } ) => {
  const notificationStyle = {
    color: 'white',
    backgroundColor: 'green',
    fontSize: '20px'
  }

  if (message === null) return null

  return (
    <div style={notificationStyle}>
      <br />
      {message}
    </div>
  )
}

const DeleteNotification = ({ message, bad }) => {
  if (message === null) return null

  const goodStyle = {
    color: 'white',
    backgroundColor: 'green',
    fontSize: '30px'
  }
  const badStyle = {
    color: 'red',
    backgroundColor: 'black',
    fontSize: '30px'
  }
  return (
    <div style={bad ? badStyle : goodStyle}>
    {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('Enter a new name')
  const [newNumber, setNewNumber] = useState('000-000-0000')
  const [newNameSearch, setNewNameSearch] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [deleteMessage, setDeleteMessage] = useState(null)
  const [deleteBool, setDeleteBool] = useState(null)

  useEffect(() => {
    personsService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const addEntry = (event) => {
    event.preventDefault()    
    if ( (persons.find(person => person.name === newName)) === undefined ) {
      const personObj = {
        name: newName,
        number: newNumber,
      }
      personsService.create(personObj).then(returnedPerson => {
        console.log(returnedPerson)
        setPersons(persons.concat(returnedPerson))
      })
      setNotificationMessage(`${newName} was added to your directory!`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
    else {
      alert(`${newName} is already in your phonebook!`)
      if (window.confirm(`${newName} is already in your phonebook.  Would you like to replace this number?`))
        updatePerson(persons.find(p => p.name === newName))
    }
    setNewName('')
    setNewNumber('')
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log('handleNumberChange', event.target.value)
    setNewNumber(event.target.value)
  }
  const handleNewNameSearchChange = (event) => {
    setNewNameSearch(event.target.value)
    const newPersonObj = persons.filter(person => person.name.toLowerCase().includes(newNameSearch))
    setPersons(newPersonObj)
  }

  const updatePerson = (personToUpdate) => {
    console.log('persontoupdate', personToUpdate)
    console.log('newnumber', newNumber)
    const updatedPerson = {...personToUpdate, number: newNumber}
    console.log('updatedPerson', updatedPerson)
    personsService.update(updatedPerson.id, updatedPerson).then(returnedPerson => {
      setPersons(persons.map(p => p.id !== returnedPerson.id ? p : returnedPerson))
    })

  }

  const handleDelete = id => {
    if (window.confirm(`Are you sure you want to delete ${persons.find(p => p.id === id).name}`)) {
      console.log('deleteding', id)
      personsService
        .deletePerson(id)
        .then(response => {
          setDeleteMessage(`Successfully deleted ${persons.find(p => p.id === id).name} from phonebook`)
          setDeleteBool(false)
          console.log('response', response)
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          console.log('error', error)
          setDeleteMessage(`${persons.find(p => p.id === id).name} already deleted from phonebook`)
          setDeleteBool(true)
          setPersons(persons.filter(p => p.id !== id))
        })
      setTimeout(() => {
        setDeleteMessage(null)
        setDeleteBool(null)
      }, 5000)
      
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} />

      <Filter newNameSearch={newNameSearch} handleNewNameSearchChange={handleNewNameSearchChange} />

      <h3>Add A New Person:</h3>

      <PersonForm addEntry={addEntry} newName={newName} handleNameChange={handleNameChange} 
        newNumber={newNumber} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>

      <DeleteNotification message={deleteMessage} bad={deleteBool} />
      
      <Persons persons={persons} handleDelete={handleDelete} />
    </div>
  )
}

export default App