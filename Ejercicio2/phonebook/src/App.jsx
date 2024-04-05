import { useState } from 'react'



const Name = ({ name }) => {
  return (
    <li>{name.name}   {name.phonenumber}</li>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phonenumber: '12345' },
    { name: 'John Doe', phonenumber: '67890' },
    { name: 'Jane Smith', phonenumber: '54321' },
    { name: 'Alice Johnson', phonenumber: '98765' },
    { name: 'Bob Brown', phonenumber: '45678' }
  ])
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter,setNewFilter] = useState('')

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  )
  


  const addName = (event) => {
    const nameExists = persons.some(person => person.name === newName)
    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
      return 
    }

    event.preventDefault()
    const noteName = {
      name : newName,
      phonenumber: newNumber
    }
    setPersons(persons.concat(noteName))
    setNewName('')
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
          <Name key={name} name={name} />
        )}
      </ul>
    </div>
  )
}

export default App