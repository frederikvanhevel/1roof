'use strict';

var cloudinary = require('cloudinary'),
  multiparty = require('multiparty');

function uploadToCloudinary(roomId, url, index, res) {
    cloudinary.uploader.upload(url, function(result) {
        if (result.error) res.send(400);
        else {
            res.send(200, {
                id: result.public_id
            });
        }
    }, { public_id: roomId + '_' + index });
}

exports.removeFromCloudinary = function(link, callback) {
    cloudinary.uploader.destroy(link, callback);
};

exports.upload = function(req, res) {
    var room = req.room;

    if (req.body.link) {
        uploadToCloudinary(room._id, req.body.link, req.body.index, res);
    } else {
        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files) {
            if (files === undefined || files.file.length === 0) return;
            uploadToCloudinary(room._id, files.file[0].path, fields.index[0], res);
        });
    }

};

exports.remove = function(req, res, next, index, callback) {
    var room = req.room;
    this.removeFromCloudinary(room.pictures[index].link, callback);
};
