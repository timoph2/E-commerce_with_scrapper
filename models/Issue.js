const mongoose = require('mongoose')
const {Schema,model} = mongoose;


const IssueSchema = new Schema({
                  
})              

//because mongoose will run it again when creating, hence save fx not call it. 
//but outside of mongoose default, need call Date() instead
 
// module.exports = mongoose.model('Issue', IssueSchema)
















