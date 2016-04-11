"use strict";
(function () {

    app.Users.UsersSrv = {
        getAllUsers: getAllUsers,
        deleteUser: deleteUser,
        saveUser: saveUser
    };

    var users = [
        {firstName: "Jon", lastName: "Malkovich", mail: "jon@mail.com", id: createId()},
        {firstName: "Ivan", lastName: "Petrov", mail: "petrov@mail.com", id: createId()},
        {firstName: "Petr", lastName: "First", mail: "stpiter@mail.com", id: createId()}
    ];

    function getAllUsers (callback) {
        if (callback) {
            callback(users)
        }
        return users;
    }

    function deleteUser (userId, callback) {

        var removeUser = userId;

        for (var i = 0; i < users.length; i++) {
            if (userId === users[i].id)
                users.splice(i, 1);
        }
        if (callback) {
            callback(removeUser);
        }

        return removeUser;
    }

    function saveUser (userDTO, callback) {

        var editUser = userDTO;

        if (editUser.id !== undefined) {
            for (var i = 0; i < users.length; i++) {
                if (editUser.id === users[i].id)
                    users.splice(i, 1, editUser)
            }
        } else {
            editUser.id = createId();
            users.push(editUser);
        }

        if (callback) {
            callback(editUser);
        }

        return editUser;
    }

    function createId() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

}());




