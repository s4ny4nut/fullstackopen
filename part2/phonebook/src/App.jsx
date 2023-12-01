import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services';


const Persons = ({persons, filterName, onClick}) => {
  return (
    persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()) || filterName === '')
        .map(person => 
        <p key={person.name}>{person.name} {person.number} <button onClick={() => onClick(person.id)}>Delete</button></p>
    )
  )
}

const PersonForm = ({id, onSubmit, newName, newNumber, handleChangeName, handleChangeNumber}) => {
  return (
    <form onSubmit={onSubmit}>
        <div>
          name: <input type='text' value={newName} onChange={handleChangeName}/>
        </div>
        <div>
          number: <input type='tel' value={newNumber} onChange={handleChangeNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Filter = ({filterName, onChange}) => {
  return (
    <div>
      <label htmlFor='filter'>filter shown with</label>
      <input id='filter' name='filter' type='text' value={filterName} onChange={onChange}/>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [message, setMessage] = useState({isError: null, text: null})

  const handleChangeName = (event) => {
    setNewName(event.target.value)
  }

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  }

  const handleSubmitNewName = (event) => {
    event.preventDefault();

    const newNameObj = {
      id: persons.length + 1,
      name: newName, 
      number: newNumber
    }

    const isNameDuplicate = persons.some(person => {
      if(JSON.stringify(person.name) === JSON.stringify(newName)) {
        return true
      }
      return false
    })

    if(isNameDuplicate) {
      const nameObj = persons.find(person => person.name === newName)
      const nameId = nameObj.id
      const isConfirmedUpdate = confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)

      if(isConfirmedUpdate) {
        personService
        .update(nameId, {...nameObj, number: newNumber})
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== nameId ? person : returnedPerson))
        })
        .catch(error => {
          setPersons(persons.filter(person => person.id !== nameId))
          setMessage(prevState => {
            return {
              ...prevState,
              isError: true,
              text: `Information of ${nameObj.name} has already been removed from server`
            }
          })
          setTimeout(() => {
            setMessage(prevState => {
              return {
                ...prevState,
                isError: null,
                text: null
              }
            })
          }, 3000)
        })
        setNewName('');
        setNewNumber('');
      }
    } else {
      personService
        .create(newNameObj)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setMessage(prevState => {
            return {
              ...prevState,
              isError: false,
              text: `Added ${returnedPerson.name}`
            }
          })
          setTimeout(() => {
            setMessage(prevState => {
              return {
                ...prevState,
                isError: null,
                text: null
              }
            })
          }, 3000)
        })
    }
  }

  const handleChangeNumber = event => {
    setNewNumber(event.target.value)
  }

  const Notification = ({message}) => {
      if(message.text === null) {
        return null;
      }
      return (
        <div className={`notification ${message.isError ? 'error' : 'success'}`}>
            {message.text}
        </div>
      )
  }

  const handleRemovePerson = (id) => {
    const newPersons = persons.filter(person => person.id !== id);
    const personName = persons.find(person => person.id === id).name;
    const confirmDelete = confirm(`Delete ${personName}`)

    if(confirmDelete) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(newPersons)
        })
    }
  }

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <Filter filterName={filterName} onChange={handleFilterName}/>
      <h2>add a new</h2>
      <PersonForm 
        onSubmit={handleSubmitNewName} 
        handleChangeName={handleChangeName} 
        handleChangeNumber={handleChangeNumber}
        newName={newName} 
        newNumber={newNumber}   
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filterName={filterName} onClick={handleRemovePerson}/>
    </div>
  )
}

export default App