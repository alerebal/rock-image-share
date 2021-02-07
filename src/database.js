const mongoose = require('mongoose');


mongoose.connect(`mongodb+srv://${process.env.MONGO_DB}:${process.env.MONGO_KEY}@cluster0-x2ibd.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err));

