var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = new Schema(
    {
      "title": {type: String, required: true, maxlength: 100},
      "artist": {type: Schema.Types.ObjectId, ref: 'Artist', required: true},
      "length": {type: String, required:true}
    }
  );

SongSchema
.virtual('url')
.get(function () {
return '/hub/song/' + this._id;
});

module.exports = mongoose.model('Song', SongSchema);