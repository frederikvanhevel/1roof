'use strict';

var cloudinary = require('cloudinary'),
  multiparty = require('multiparty');

function uploadToCloudinary(url, res) {
    cloudinary.uploader.upload(url, function(result) {
        if (result.error) res.send(400);
        else {
            res.send(200, {
                id: result.public_id
            });
        }
    });
}

exports.removeFromCloudinary = function(link, callback) {
    cloudinary.uploader.destroy(link, callback);
};

exports.upload = function(req, res) {

    if (req.body.link) {
        uploadToCloudinary(req.body.link, res);
    } else {
        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files) {
            if (files === undefined || files.file.length === 0) return;
            uploadToCloudinary(files.file[0].path, res);
        });
    }

};

exports.remove = function(req, res, next, index, callback) {
    var room = req.room;
    var picture = room.pictures[index];

    if (picture) this.removeFromCloudinary(picture.link, callback);
    else callback({ error: 'picture not found' });
};
