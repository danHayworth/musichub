var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
      "_id": mongoose.Schema.Types.ObjectId,
      "email": {
        type: String,
        required: true, 
        unique:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 
        maxlength: 70},
      "password": {type: String, required:true}
    }
  );
UserSchema
.virtual('url')
.get(function () {
return 'user/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);