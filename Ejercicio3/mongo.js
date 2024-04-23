const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
console.log(process.argv.length)
const password = process.argv[2]

const url = `mongodb+srv://custodito18:${password}@cluster0.vxw0vkl.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)



const personSchema = new mongoose.Schema({
    name : String,
    number : Number,
})
const Person = mongoose.model('Person',personSchema)

if (process.argv.length ===  5){
    console.log('adding person....')
    const person  = new Person({
        name: process.argv[3],
        number:process.argv[4],
      })
      person.save().then(result => {
        console.log(`Added ${process.argv[3]} ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
      })
}
if (process.argv.length === 3){
    Person.find({}).then(result =>{
        console.log('Phonebook:')
        result.forEach(person =>{
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}



