// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID=mongodb.ObjectID 
const { MongoClient, ObjectID } = require('mongodb')


const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id=new ObjectID()
console.log(id)
console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
    if(error) {
        return console.log('Unable to connect to database')
    }

    const db = client.db(databaseName)
   
//     db.collection('users').findOne({ _id: new ObjectID("609d69d804c7b785c4cae71d") }, (error, user) => {
//         if (error)
//             return console.log('Unable to find')
//         console.log(user)
//     })
//     db.collection('users').find({ age: 21 }).toArray((error, users) => {
//         if (error)
//             return console.log('Could not fetch users')
//         console.log(users)
// } )
    // db.collection('tasks').findOne({ _id: new ObjectID("609d4d7368736675c4662817") }, (error, task) => {
    //     if (error)
    //         return console.log('Unable to fetch the task')
    //     console.log(task)
    // })
    // db.collection('tasks').find({ completed: true }).toArray((error, tasks) => {
    //     if (error)
    //         return console.log('Unable to fetch the list of tasks')
    //     console.log(tasks)
    // })

    // db.collection('users').updateOne({
    //     _id: new ObjectID("609d69d804c7b785c4cae71d")
    // }, {
    //     $inc: {
          
    //         age:4
            
    //     } 
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)

    // })
   
    db.collection('users').deleteMany({ age: 27 }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })




})
