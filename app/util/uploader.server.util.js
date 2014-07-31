'use strict';

var cloudinary = require('cloudinary'),
  multiparty = require('multiparty');

exports.upload = function(req, res) {
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
};

exports.remove = function(req, res, next, index, callback) {
  var room = req.room;
  cloudinary.uploader.destroy(room.pictures[index].link, callback);
};