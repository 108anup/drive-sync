//	drive-sync
//  Copyright (C) 2016  Saurabh Batra
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

// rm.js

// Usage: drive-sync rm <file-name>
// Delete the named file from Drive.

//Todo:: Add rm -r to delete Directory

var deasync = require('deasync');
var fs = require('fs');
var google = require('googleapis');
var authtoken = require(appRoot+'/src/auth.js');
var auth = authtoken();

module.exports = function(file) {

    var found = findFile(file,pwd);

    if (!found) {
        console.log('No such File as %s.', file);
        return;
    }
    else if(found == -1){
        console.log('$s is a Directory not a File, Please enter a valid File Name.',file);
    }

    removeFile(found);
}

function findFile(fname, dir) {
    var sync = true;
    var found = false;
    var service = google.drive('v3');
    service.files.list({
        q: "'"+dir+"' in parents",
        auth: auth,
        fields: "files(name, mimeType, id)",
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        var files = response.files;
        if (files.length == 0) {
            console.log('%s Directory is Empty.',dir);
            return false;
        } else {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (fname == file.name) {
                    if (file.mimeType != 'application/vnd.google-apps.folder') {
                        found = file.id;
                    }
                    else{
                        found = -1;
                    }
                }
            }
        }
        sync = false;
    });

    while(sync) {deasync.sleep(100);}

    return found;
}

function removeFile(fid){
    var sync = true;
    var service = google.drive('v2'); //As could not find any non permanent deletion query in v3

    service.files.trash({
        fileId: fid,
        auth: auth
    }, function(err,response){

        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var file = response;

        //Since we already found file earlier therefore file should not be a null variable.
        //Don't know why response could be null so have not handled it.
        if(file){
            if(file.id == fid)
                console.log("Successfully Deleted File: %s in the Directory with id %s.",file.title,file.parents[0].id);
        }

    });

    while(sync) {deasync.sleep(100);}
}