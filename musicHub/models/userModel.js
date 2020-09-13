var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
      "_id": mongoose.Schema.Types.ObjectId,
      "name": {type: String, required: true, maxlength: 100},
      "email": {type: String, required: true, maxlength: 70},
      "password": {type: String, required:true}
    }
  );

AlbumSchema
.virtual('url')
.get(function () {
return 'user/' + this._id;
});

module.exports = mongoose.model('Album', AlbumSchema);