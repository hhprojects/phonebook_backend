const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://hsquare:${password}@fullstackopen.s5iue.mongodb.net/?retryWrites=true&w=majority&appName=FullStackOpen`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    id: String,
    name: String,
    number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)



if (process.argv.length == 3){
    Phonebook.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person =>{
            console.log(person)
        })
        mongoose.connection.close()
    })
}else{
    const getRandomInt = () => {
        return Math.floor(Math.random() * 10000).toString();
    }
    const id = getRandomInt()

    const person = new Phonebook({
        id: id,
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}