const mongoose = require('mongoose')
const mongoDb = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('database is connected')
    }).catch((err) => {
        console.log("somthing went wrong", err)
    })
}
module.exports = mongoDb