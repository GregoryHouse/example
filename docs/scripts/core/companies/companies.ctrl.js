"use strict";
(function () {

    var CompanyService = app.Companies.CompaniesSrv;

    var companies = CompanyService.getAllCompanies();

    companies.sort(function (a, b) {
        if (a.companyName > b.companyName) {
            return 1;
        }
        if (a.companyName < b.companyName) {
            return -1;
        }
        return 0;
    });


    app.Companies.CompaniesCtrl = {
        renderCompany: renderCompany,
        renderCompanies: renderCompanies,
        openCompanyForm: openCompanyForm,
        saveCompany: saveCompany,
        deleteCompany: deleteCompany,
        closeForm: closeForm
    };

    function renderCompany(company, isCreate, companiesList) {

        if (!companiesList) {
            var companiesList = document.querySelector('.companies-list');
        }
        if (!isCreate) {
            var oldCompanyElement = document.querySelector('[data-company-id=\'' + company.id + '\']');
        }
        var companyElement = function() {
            var clone = document.querySelector('.company-content');
            var companyLi = clone.cloneNode(true);
            companyLi.setAttribute('data-company-id', company.id);
            companyLi.classList.remove('hide');

            companyLi.querySelector('.name-field').textContent = company.companyName;
            companyLi.querySelector('.address-field').textContent = company.addressCompany;
            companyLi.querySelector('.email-field').textContent = company.companyMail;

            var editButton = companyLi.querySelector(".button-edit");
            var deleteButton = companyLi.querySelector(".button-delete");

            editButton.addEventListener("click", openCompanyForm.bind(company));
            deleteButton.addEventListener("click", deleteCompany.bind(company));


            return companyLi;
        };

        if (isCreate) {
            companiesList.appendChild(companyElement());
        } else {
            companiesList.replaceChild(companyElement(), oldCompanyElement);
        }
    }

    function renderCompanies() {


        if (companies.length === 0) {
            return
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/app/scripts/core/companies/companies.tpl.html', true);

        xhr.onreadystatechange = function () {

            if (xhr.readyState != 4) return;
            if (this.status === 200) {

                document.getElementById('container').innerHTML = this.responseText;
                var companyForm = document.querySelector('.add-company');
                companyForm.setAttribute('data-company-id', 'undefined');

                var addButton = companyForm.querySelector(".button-add");
                addButton.addEventListener("click", openCompanyForm);

                var companiesList = document.querySelector('.companies-list');

                for (var i = 0; i < companies.length; i++) {
                    renderCompany(companies[i], true, companiesList);
                }

                document.querySelector('.companies-link').classList.add('underline');
                document.querySelector('.users-link').classList.remove("underline");
            }
        };
        xhr.send();

    }

    function openCompanyForm() {

        var company = this;

        closeOldForm(companies);

        if (!company.id) {
            company = {companyName: "", addressCompany: "", companyMail: ""};
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/app/scripts/core/companies/company-form.tpl.html', true);

        var companyForma = document.createElement('div');
        companyForma.className = " edit-company-form";
        companyForma.setAttribute('data-edit-company-form', company.id);

        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (this.status === 200) {
                companyForma.innerHTML = this.responseText;

                var userElement = document.querySelector('[data-company-id=\'' + company.id + '\']');
                userElement.className =  company.id ? 'edit-company' : 'new-company';
                userElement.appendChild(companyForma);
                form(company);
            }
        };

        xhr.send();
    }

    function saveCompany(company) {

        var company = this;

        var form = document.querySelector('[data-edit-company-form=\'' + company.id + '\']').firstChild;
        var isValidName = validateName.call(form.companyName);
        var isValidEmail = validateMail.call(form.companyMail);

        if (isValidName && isValidEmail) {

            var companyDTO = {
                id: company.id ? company.id : undefined,
                companyName: form.companyName.value,
                addressCompany: form.addressCompany.value,
                companyMail: form.companyMail.value
            };

            CompanyService.saveCompany(companyDTO, function (editCompany) {
                closeForm(company);
                renderCompany(editCompany, !company.id);
            });
        }
    }

    function deleteCompany() {

        var companiesList = document.querySelector('.companies-list');
        CompanyService.deleteCompany(this.id, function (removeCompany) {
            var oldCompanyElement = document.querySelector('[data-company-id=\'' + removeCompany + '\']');
            companiesList.removeChild(oldCompanyElement);
        });
    }

    function closeForm(company) {
        if (company === event) {
            var company = this;
        }

        var companyElement = document.querySelector('[data-company-id=\'' + company.id + '\']');
        companyElement.removeChild(companyElement.lastChild);
        companyElement.className =  company.id ?  'company-content' :'add-company';
    }

    function form(company) {

        var companyForm = document.querySelector('[data-edit-company-form=\'' + company.id + '\']');
        var inputName = companyForm.querySelector('[data-input-name=input-company-name]');
        var inputSurname = companyForm.querySelector('[data-input-address=input-company-address]');
        var inputMail = companyForm.querySelector('[data-input-mail=input-company-mail]');

        inputName.value = company.companyName;
        inputSurname.value = company.addressCompany;
        inputMail.value = company.companyMail;

        var saveButton = companyForm.querySelector(".button-save");
        var closeButton = companyForm.querySelector(".button-close");

        saveButton.addEventListener("click", app.Companies.CompaniesCtrl.saveCompany.bind(company));
        closeButton.addEventListener("click", app.Companies.CompaniesCtrl.closeForm.bind(company));
        inputName.addEventListener("input", validateName.bind(inputName));
        inputMail.addEventListener("input", validateMail.bind(inputMail));

    }

    function closeOldForm(companies) {

        var form = document.querySelector('[data-edit-company-form]');

        if (form) {
            var oldUser = {companyName: "", addressCompany: "", companyMail: ""};
            var oldFormId = form.getAttribute('data-edit-company-form');
            for (var i = 0; i < companies.length; i++) {
                if (companies[i].id === oldFormId) {
                    oldUser = companies[i];
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
            labelInput.textContent = "Company Name is required";
            btnDisabled.disabled = true;
            return false
        }
        if (nameInput.value.length < 3) {
            parentElement.classList.add('has-error');
            labelInput.textContent = "Company Name is too hort";
            btnDisabled.disabled = true;
            return false
        }
        if (nameInput.value.length > 20) {
            parentElement.classList.add('has-error');
            labelInput.textContent = "Company Name is too large";
            btnDisabled.disabled = true;
            return false
        }

        labelInput.textContent = "Company Name";
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