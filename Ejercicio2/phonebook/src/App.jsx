import { useState,useEffect } from 'react'
import axios from 'axios'
import personService from './services/phones'



const Name = ({ name,handleRemove }) => {
  const label = "Delete"
  return (
    <li>{name.name} {name.phonenumber}
    <button onClick={handleRemove}>{label}</button>
    </li>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter,setNewFilter] = useState('')

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
        const updatedPerson = {...existingPerson, phonenumber : newNumber, }
        personService
        .update(existingPerson.id,updatedPerson)
        .then(returnedPerson =>{
          setPersons(persons.map(person => person.id !== existingPerson.id ? person: returnedPerson) )
        })
      }
      return
      
    }

    event.preventDefault()
    const personObject = {
      name : newName,
      phonenumber: newNumber
    }
    personService
    .create(personObject).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
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