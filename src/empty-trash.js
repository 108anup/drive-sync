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

// empty-trash.js

// Usage: drive-sync empty-trash
// Permanently deletes the Contents of the Trash Folder.


var deasync = require('deasync');
var fs = require('fs');
var google = require('googleapis');
var authtoken = require(appRoot+'/src/auth.js');
var auth = authtoken();

module.exports = function() {

    var sync = true;
    var service = google.drive('v3');

    service.files.trash({
        auth: auth
    }, function(err,response){

        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        if(!response){
            console.log('Operation Successful');
        }
        else{
            console.log('Could not Empty Trash');
        }

    });

    while(sync) {deasync.sleep(100);}
}