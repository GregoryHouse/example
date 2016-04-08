"use strict";
(function () {

    var UserService = app.Users.UsersSrv;

    var users = UserService.getAllUsers();

    users.sort(function (a, b) {
        if (a.firstName > b.firstName) {
            return 1;
        }
        if (a.firstName < b.firstName) {
            return -1;
        }
        return 0;
    });

    app.Users.UsersCtrl = {
        renderUser: renderUser,
        renderUsers: renderUsers,
        openUserForm: openUserForm,
        saveUser: saveUser,
        deleteUser: deleteUser,
        closeForm: closeForm
    };

    renderUsers();

    function renderUser(user, isCreate, usersList) {
        if (!usersList) {
            var usersList = document.querySelector('.users-list');
        }

        if (!isCreate) {
            var oldUserElement = document.querySelector('[data-user-id=\'' + user.id + '\']');
        }

        var userElement = function () {
            var clone = document.querySelector('.user-content');
            var userLi = clone.cloneNode(true);
            userLi.setAttribute('data-user-id', user.id);
            userLi.classList.remove('hide');

            userLi.querySelector('.f-name-field').textContent = user.firstName;
            userLi.querySelector('.l-name-field').textContent = user.lastName;
            userLi.querySelector('.email-field').textContent = user.mail;

            var editButton = userLi.querySelector(".button-edit");
            var deleteButton = userLi.querySelector(".button-delete");

            editButton.addEventListener("click", openUserForm.bind(user));
            deleteButton.addEventListener("click", deleteUser.bind(user));


            return userLi;
        };

        if (isCreate) {
            usersList.appendChild(userElement());

        } else {
            usersList.replaceChild(userElement(), oldUserElement);
        }
    }

    function renderUsers() {



        if (users.length === 0) {
            return
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/app/scripts/core/users/users.tpl.html', true);

        xhr.onreadystatechange = function () {

            if (xhr.readyState != 4) return;
            if (this.status === 200) {
                document.getElementById('container').innerHTML = this.responseText;

                var userForm = document.querySelector('.add-user');
                userForm.setAttribute('data-user-id', 'undefined');

                var addButton = userForm.querySelector(".button-add");
                addButton.addEventListener("click", openUserForm);

                var usersList = document.querySelector('.users-list');

                for (var i = 0; i < users.length; i++) {
                    renderUser(users[i], true, usersList);
                }

                document.querySelector('.users-link').classList.add('underline');
                document.querySelector('.companies-link').classList.remove("underline");

            }
        };
        xhr.send();
    }

    function openUserForm() {

        var user = this;

        closeOldForm(users);

        if (!user.id) {
            user = {firstName: "", lastName: "", mail: ""};
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/app/scripts/core/users/user-form.tpl.html', true);

        var userForma = document.createElement('div');
        userForma.className = " edit-user-form";
        userForma.setAttribute('data-edit-user-form', user.id);

        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (this.status === 200) {
                userForma.innerHTML = this.responseText;
                var userElement = document.querySelector('[data-user-id=\'' + user.id + '\']');
                userElement.className = user.id ? 'edit-user' : 'new-user';
                userElement.appendChild(userForma);
                form(user);
            }
        };

        xhr.send();
    }

    function saveUser(user) {

        var user = this;
        console.log(user)
        var form = document.querySelector("[data-edit-user-form='" + user.id + "']").firstChild;
        var isValidName = validateName.call(form.firstName);
        var isValidEmail = validateMail.call(form.mail);

        if (isValidName && isValidEmail) {
            var userDTO = {
                firstName: form.firstName.value,
                lastName: form.lastName.value,
                mail: form.mail.value,
                id: user.id ? user.id : undefined
            };

            UserService.saveUser(userDTO, function (editUser) {
                console.log(user)
                closeForm(user);
                renderUser(editUser, !user.id);
            });
        }
    }

    function deleteUser() {

        var usersList = document.querySelector('.users-list');
        UserService.deleteUser(this.id, function (removeUser) {
            var oldUserElement = document.querySelector('[data-user-id=\'' + removeUser + '\']');
            usersList.removeChild(oldUserElement);
        });
    }

    function closeForm(user) {

        if(user === event) {
            var user = this;
        }
        var userElement = document.querySelector('[data-user-id=\'' + user.id + '\']');
        userElement.removeChild(userElement.lastChild);
        userElement.className = user.id ? 'user-content' : 'add-user';
    }

    function form(user) {

        var userForm = document.querySelector('[data-edit-user-form=\'' + user.id + '\']');
        var inputName = userForm.querySelector('[data-input-name=input-user-name]');
        var inputSurname = userForm.querySelector('[data-input-surname=input-user-surname]');
        var inputMail = userForm.querySelector('[data-input-mail=input-user-mail]');

        inputName.value = user.firstName;
        inputSurname.value = user.lastName;
        inputMail.value = user.mail;

        var saveButton = userForm.querySelector(".button-save");
        var closeButton = userForm.querySelector(".button-close");

        saveButton.addEventListener("click", app.Users.UsersCtrl.saveUser.bind(user));
        closeButton.addEventListener("click", app.Users.UsersCtrl.closeForm.bind(user));
        inputName.addEventListener("input", validateName.bind(inputName));
        inputMail.addEventListener("input", validateMail.bind(inputMail));

    }

    function closeOldForm(users) {

        var form = document.querySelector('[data-edit-user-form]');

        if (form) {
            var oldUser = {firstName: "", lastName: "", mail: ""};
            var oldFormId = form.getAttribute('data-edit-user-form');
            for (var i = 0; i < users.length; i++) {
                if (users[i].id === oldFormId) {
                    oldUser = users[i];
                }
            }
            closeForm(oldUser);
        }
    }

    function validateName() {

        var nameInput = this;
        var btnDisabled = document.querySelector('.button-save');
        var parentElement = nameInput.parentElement;

        var labelInput = parentElement.querySelector('.label');

        if (!nameInput.value) {
            parentElement.classList.add('has-error');
            labelInput.textContent = "First Name is required";
            btnDisabled.disabled = true;
            return false
        }
        if (nameInput.value.length < 3) {
            parentElement.classList.add('has-error');
            labelInput.textContent = "First Name is too hort";
            btnDisabled.disabled = true;
            return false
        }
        if (nameInput.value.length > 20) {
            parentElement.classList.add('has-error');
            labelInput.textContent = "First Name is too large";
            btnDisabled.disabled = true;
            return false
        }

        labelInput.textContent = "First Name";
        parentElement.classList.remove('has-error');
        btnDisabled.disabled = false;
        return true
    }

    function validateMail() {
        var regExp = /^\w+@\w+\.\w{2,4}$/;

        var emailInput = this;
        var btnDisabled = document.querySelector('.button-save');
        var parentElement = emailInput.parentElement;
        var labelInput = parentElement.querySelector('.label');

        if (!emailInput.value) {
            parentElement.classList.add('has-error');
            labelInput.textContent = "Email is required";
            btnDisabled.disabled = true;
            return false
        }
        if (!regExp.test(emailInput.value)) {
            parentElement.classList.add('has-error');
            labelInput.textContent = "Incorrect email";
            btnDisabled.disabled = true;
            return false
        }

        labelInput.textContent = "Mail";
        parentElement.classList.remove('has-error');
        btnDisabled.disabled = false;

        return true
    }


}());