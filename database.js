var mongoose = require('mongoose');
var mongoUri = "mongodb://localhost:27017/jeopardy";
mongoose.connect(mongoUri, { useNewUrlParser: true })
.then(function(){
    console.log("MongoDB connected");
})
.catch(function(error){
    console.log("Error connecting to MongoDB: " + error);
});

const baseConfig = {
    discriminatorKey: "_type",
    collection: "data"
};
const commonModel = mongoose.model('Common', new mongoose.Schema({}, baseConfig));
const Clue = commonModel.discriminator('Clue', new mongoose.Schema({
    round: Number,
    category: String,
    clue: String, 
    answer: String,
    wrong: Boolean,
    value: String, 
    dailydouble: Boolean,
    finaljeopardy: Boolean
}));

module.exports = Clue;