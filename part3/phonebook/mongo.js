const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://s4ny4nut:${password}@cluster0.jpulibt.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name,
  number
})

if(process.argv.length === 3) {
  Person.find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(item => {
        console.log(item.name, item.number)
      })
      mongoose.connection.close()
    })
}

if(process.argv.length > 3) {
  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}


