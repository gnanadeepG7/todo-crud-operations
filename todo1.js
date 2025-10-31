
// js file---------------------------------
let btn = document.getElementById('btn');
let popupContainer = document.getElementById('popup-container');
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

// Open popup                             
btn.addEventListener('click', function () {
    errorMsg.style.display = 'none';
    popupContainer.style.display = 'flex';
});

// Close popup when icon is clicked
document.getElementById('icon').addEventListener('click', function () {
    popupContainer.style.display = 'none';
    errorMsg.style.display = 'none';
});

// the table with updated user data
function rTable(users) {
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    if (users.length === 0) {
        let row = table.insertRow();
        let cell = row.insertCell(0);
        cell.colSpan = 6;
        cell.id = "empty-row";
        cell.textContent = `No data available. Please add a data.`;
        return;
    }
    // Add each user row to the table
    users.forEach((user, idx) => addRowToTable(user, idx));
}
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
    let email = email1.value;
    let comments = comments1.value;

    if (fname === "" || lname === "" || age === "" || dob === "" || email === "") {
        errorMsg.style.display = 'block';
        errorMsg.textContent = "Please fill all fields";
        return;
    }
    // dob future not open
    const today = new Date();
    if (new Date(dob) > today) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = "DOB cannot be in the future";
        return;
    }
    errorMsg.style.display = 'none';
    let user = { fname, lname, age, dob, email, comments };
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Update the  new user
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
// Add a user row to the table
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
                <p class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></p>
                <p class="delete-btn"><i class="fa-solid fa-trash-can"></i></p>
            </div>
        </td>
    `;
    let editBtn = newRow.querySelector('.edit-btn');
    let deleteBtn = newRow.querySelector('.delete-btn');

    // Delete user handler
    deleteBtn.addEventListener('click', function () {
        pendingDeleteIndex = parseInt(newRow.index);
        confirmMsg.textContent = `Are you sure you want to delete ${user.fname} ${user.lname}?`;
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
    // Edit user handler
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
//  calculate the age from DOB
dob1.addEventListener('change', function () {
    let dob = new Date(dob1.value);
    let age = calculateAge(dob);
    age1.value = age;
})
function calculateAge(dob) {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}
