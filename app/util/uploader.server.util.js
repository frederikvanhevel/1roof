'use strict';

var cloudinary = require('cloudinary'),
  multiparty = require('multiparty');

exports.cloudinaryUploader = {
  upload: function(req, res) {
    var room = req.room;
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
      if (files === undefined || files.file.length === 0) return;
      cloudinary.uploader.upload(files.file[0].path, function(result) {
        res.send(200, {
          id: result.public_id
        });
      }, { public_id: room._id + '_' + fields.index[0] });
    });
  },

  remove: function(req, res) {
    var room = req.room;
    cloudinary.uploader.destroy(req.query.id, function(result) {
      room.pictures.splice(req.query.index, 1);
      res.jsonp(room);
    });
  }
};