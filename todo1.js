


        let btn = document.getElementById('btn');
        let popupContainer = document.getElementById('popup-container');
        let popupBody = document.getElementById('popup-body');
        let table = document.getElementById('table');
        let form = document.querySelector('form');

        let fname1 = document.getElementById('fname');
        let lname1 = document.getElementById('lname');
        let age1 = document.getElementById('age');
        let dob1 = document.getElementById('dob');
        let email1 = document.getElementById('email');
        let comments1 = document.getElementById('comments');
        let errorMsg = document.getElementById('error-msg');
        let editingIndex = null;

        let confirmContainer = document.getElementById('confirm-container');
        let confirmMsg = document.getElementById('confirm-msg');
        let confirmYes = document.getElementById('confirm-yes');
        let confirmNo = document.getElementById('confirm-no');
        let pendingDeleteIndex = null;

        // open form for new entry------------------
        btn.addEventListener('click', function () {
            errorMsg.style.display = 'none';
            popupContainer.style.display = 'flex';
        });
        // icon click close the form-------------------
        let closeIcon = document.getElementById('icon');
        closeIcon.addEventListener('click', function () {
            popupContainer.style.display = 'none';
            errorMsg.style.display = 'none';
        });

        function rTable(users) {
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
            users.forEach((user, idx) => addRowToTable(user, idx));
        }
        window.addEventListener('load', function () {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            rTable(users);
        });

        // submit form---------------------
        form.addEventListener('submit', function (e) {
            e.preventDefault(); 

            let fname = fname1.value;
            let lname = lname1.value;
            let age = age1.value;
            let dob = dob1.value;
            let email = email1.value;
            let comments = comments1.value;

            if (fname === "" || lname === "" || age === "" || dob === "" || email === "") {
                errorMsg.style.display = 'block';
                return;
            }
            errorMsg.style.display = 'none';

            const today = new Date();
            const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const dobDate = new Date(dob);
            const dobOnly = new Date(dobDate.getFullYear(), dobDate.getMonth(), dobDate.getDate());

            if (dobOnly > todayOnly) {
                errorMsg.textContent = 'DOB cannot be in the future';
                errorMsg.style.display = 'block';
                return;
            }

            errorMsg.style.display = 'none';

            let user = { fname, lname, age, dob, email, comments };
            let users = JSON.parse(localStorage.getItem('users')) || [];

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
        /* add data from html table-------------------- */
        function addRowToTable(user, index) {
            let newRow = table.insertRow();
            newRow.index = index;
            newRow.innerHTML = `
        <td>${user.fname} ${user.lname}</td>
        <td>${user.age}</td>
        <td>${user.dob}</td>
        <td>${user.email}</td>
        <td>${user.comments}</td>
        <td>
            <div style="display: flex; gap: 20px; cursor: pointer; margin-left:40px;">
                <p class="edit-btn"><i class="fa fa-pencil-square" aria-hidden="true" ></i></p>
                <p class="delete-btn"><i class="fa-solid fa-trash-can"></i></p>
            </div>
        </td>
    `;
            let editBtn = newRow.getElementsByClassName('edit-btn')[0];
            let deleteBtn = newRow.getElementsByClassName('delete-btn')[0];

            deleteBtn.addEventListener('click', function () {
                pendingDeleteIndex = parseInt(newRow.index);
                confirmMsg.textContent = `Are you sure to delete this entry ${user.fname} ${user.lname}?`;
                confirmContainer.style.display = 'flex';
            });
            confirmYes.addEventListener('click', function () {
                if (pendingDeleteIndex !== null) {
                    let users = JSON.parse(localStorage.getItem('users')) || [];
                    users.splice(pendingDeleteIndex, 1);
                    localStorage.setItem('users', JSON.stringify(users));
                    rTable(users);
                }
                pendingDeleteIndex = null;
                confirmContainer.style.display = 'none';
            });
            confirmNo.addEventListener('click', function () {
                pendingDeleteIndex = null;
                confirmContainer.style.display = 'none';
            });
            // edit  row--------------------------------------
            editBtn.addEventListener('click', function () {
                editingIndex = parseInt(newRow.index);
                fname1.value = user.fname;
                lname1.value = user.lname;
                age1.value = user.age;
                dob1.value = user.dob;
                email1.value = user.email;
                comments1.value = user.comments;
                errorMsg.style.display = 'none';
                popupContainer.style.display = 'flex';
            });
        }
    

