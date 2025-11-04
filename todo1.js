 
        let btn = document.getElementById('btn');
        let popupContainer = document.getElementById('popup-container');
        let table = document.getElementById('table');
        let form = document.querySelector('form');
        let fname1 = document.getElementById('fname');
        let lname1 = document.getElementById('lname');
        let age1 = document.getElementById('age');
        let dob1 = document.getElementById('dob');
        let comments1 = document.getElementById('comments');
        let errorMsg = document.getElementById('error-msg');
        let dobError = document.getElementById('dob-error');
        let contactType = document.getElementById('contactType');
        let emailField = document.getElementById('emailField');
        let phoneField = document.getElementById('phoneField');
        let email1 = document.getElementById('email');
        let phone1 = document.getElementById('phone');
        let editingIndex = null;

        let confirmContainer = document.getElementById('confirm-container');
        let confirmMsg = document.getElementById('confirm-msg');
        let confirmYes = document.getElementById('confirm-yes');
        let confirmNo = document.getElementById('confirm-no');
        let pendingDeleteIndex = null;

        // preferred type switch
        contactType.addEventListener('change', function () {
            if (contactType.value === 'email') {
                emailField.style.display = 'block';
                phoneField.style.display = 'none';
                email1.required = true;
                phone1.required = false;
            } else {
                emailField.style.display = 'none';
                phoneField.style.display = 'block';
                email1.required = false;
                phone1.required = true;
            }
        });

        // Open popup
        btn.addEventListener('click', function () {
            errorMsg.style.display = 'none';
            dobError.style.display = 'none';
            popupContainer.style.display = 'flex';
            document.getElementById('sunmit-btn').value = 'Submit';
        });

        // Close popup
        document.getElementById('icon').addEventListener('click', function () {
            popupContainer.style.display = 'none';
            form.reset();
            editingIndex = null;
        });

        // Render table
        function rTable(users) {
            while (table.rows.length > 1) table.deleteRow(1);
            if (users.length === 0) {
                let row = table.insertRow();
                let cell = row.insertCell(0);
                cell.colSpan = 8;
                cell.id = "empty-row";
                cell.textContent = "No data available. Please add a data.";
                return;
            }
            users.forEach((user, idx) => addRowToTable(user, idx));
        }

        // Load data
        window.addEventListener('load', function () {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            rTable(users);
        });

        // Form submit
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            let fname = fname1.value;
            let lname = lname1.value;
            let age = age1.value;
            let dob = dob1.value;
            let contactTypeValue = contactType.value;
            let contactValue = contactTypeValue === 'email' ? email1.value : phone1.value;
            let comments = comments1.value;

            if (fname === "" || lname === "" || age === "" || dob === "" || contactValue === "") {
                errorMsg.style.display = 'block';
                errorMsg.textContent = "Please fill all required fields.";
                return;
            }

            if (new Date(dob) > new Date()) {
                dobError.style.display = 'block';
                return;
            } else {
                dobError.style.display = 'none';
            }

            let users = JSON.parse(localStorage.getItem('users')) || [];
            let status = "Pending";
            let user = { fname, lname, age, dob, contactType: contactTypeValue, contactValue, comments, status };

            if (editingIndex !== null) {
                users[editingIndex] = user;
            } else {
                users.push(user);
            }
            localStorage.setItem('users', JSON.stringify(users));
            rTable(users);
            popupContainer.style.display = 'none';
            form.reset();
            editingIndex = null;
        });
        // Add row to table
        function addRowToTable(user, index) {
            let newRow = table.insertRow();
            newRow.innerHTML = `
        <td>${user.fname} ${user.lname}</td>
        <td>${user.age}</td>
        <td>${user.dob}</td>
        <td>${user.contactType}</td>
        <td>${user.contactValue}</td>
        <td>${user.comments}</td>
        <td>${user.status}</td>
        <td>
            <div style="display:flex;gap:10px;justify-content:center;align-items:center;">
                <input type="checkbox" class="status-checkbox" ${user.status === 'Completed' ? 'checked' : ''}>
                <p class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></p>
                <p class="delete-btn"><i class="fa-solid fa-trash-can"></i></p>
            </div>
        </td>
    `;
            // Checkbox status
            let checkbox = newRow.querySelector('.status-checkbox');
            checkbox.addEventListener('change', function () {
                let users = JSON.parse(localStorage.getItem('users')) || [];
                users[index].status = this.checked ? "Completed" : "Pending";
                localStorage.setItem('users', JSON.stringify(users));
                rTable(users);
            });

            // Delete button
            newRow.querySelector('.delete-btn').addEventListener('click', function () {
                pendingDeleteIndex = index;
                confirmMsg.textContent = `Are you sure you want to delete ${user.fname} ${user.lname}?`;
                confirmContainer.style.display = 'flex';
            });

            confirmYes.onclick = function () {
                if (pendingDeleteIndex !== null) {
                    let users = JSON.parse(localStorage.getItem('users')) || [];
                    users.splice(pendingDeleteIndex, 1);
                    localStorage.setItem('users', JSON.stringify(users));
                    rTable(users);
                }
                confirmContainer.style.display = 'none';
                pendingDeleteIndex = null;
            };

            confirmNo.onclick = function () {
                confirmContainer.style.display = 'none';
                pendingDeleteIndex = null;
            };

            // Edit button
            newRow.querySelector('.edit-btn').addEventListener('click', function () {
                editingIndex = index;
                fname1.value = user.fname;
                lname1.value = user.lname;
                age1.value = user.age;
                dob1.value = user.dob;
                contactType.value = user.contactType;
                if (user.contactType === 'email') {
                    contactType.value = 'email';
                    emailField.style.display = 'block';
                    phoneField.style.display = 'none';
                    email1.value = user.contactValue;
                } else {
                    contactType.value = 'phone';
                    phoneField.style.display = 'block';
                    emailField.style.display = 'none';
                    phone1.value = user.contactValue;
                }
                comments1.value = user.comments;
                document.getElementById('sunmit-btn').value = 'Update';
                popupContainer.style.display = 'flex';
            });
        }

        //  age when DOB changes
        dob1.addEventListener('change', function () {
            let dob = new Date(dob1.value);
            age1.value = calculateAge(dob);
        });

        // DOB from Age
        age1.addEventListener('change', function () {
            let age = parseInt(age1.value);
            if (!isNaN(age) && age >= 0) {
                const today = new Date();
                const birthYear = today.getFullYear() - age;
                const dob = new Date(today.setFullYear(birthYear));
                dob1.value = dob.toISOString().split('T')[0];
            }
        });

        function calculateAge(dob) {
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
            return age;
        }
    