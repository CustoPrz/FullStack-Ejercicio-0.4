import { useState,useEffect } from 'react'
import axios from 'axios'
import personService from './services/phones'



const Name = ({ name,handleRemove }) => {
  const label = "Delete"
  return (
    <li>{name.name} {name.number}
    <button onClick={handleRemove}>{label}</button>
    </li>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="aded">
      {message}
    </div>
  )
}
const NotificationError = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter,setNewFilter] = useState('')
  const [adedMessage, setadedMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPerson => {
        setPersons(initialPerson)
      })
  }, [])


  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  )
  


  const addName = (event) => {
    const nameExists = persons.some(person => person.name === newName)
    if (nameExists) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one`)){
        const existingPerson = persons.find(person => person.name === newName)
        const updatedPerson = {...existingPerson, number : newNumber, }
        personService
        .update(existingPerson.id,updatedPerson)
        .then(returnedPerson =>{
          setPersons(persons.map(person => person.id !== existingPerson.id ? person: returnedPerson))
          setadedMessage(`Updated ${newName}`)
          setTimeout(() => {
            setadedMessage(null)
          }, 4000)
        }).catch(error => {
          setErrorMessage(
            `Failed to update ${newName}: ${error.message}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 4000)
          setPersons(persons.filter(n => n.id !== id))
        })
      }
      return
      
    }

    event.preventDefault()
    const personObject = {
      name : newName,
      number: newNumber,
      id : String(persons.length + 1 )
    }
    console.log(personObject)
    personService
    .create(personObject).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
    setadedMessage(`Aded ${personObject.name}`)
    setTimeout(() =>{
      setadedMessage(null)},4000)
  }

 const removePerson = (id) => {
    personService.remove(id).then(() => {
      setPersons(persons.filter(person => person.id !== id));
    })
 }
  



  const handleNameChange= (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange= (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange= (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={adedMessage}/>
      <NotificationError message={errorMessage} />
      <div>
          filter: <input value={newFilter} onChange={handleFilterChange} />
        </div>
      <h2>Add new</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
        <div>debug: {newName}</div>
      </form>
      <h2>Numbers</h2>
      <ul>
      {filteredPersons.map(name =>
          <Name key={name.id} name={name} handleRemove = {() => removePerson(name.id)}  />
        )}
      </ul>
    </div>
  )
}

export default App