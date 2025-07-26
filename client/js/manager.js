
let currentPage = 1;
const limit = 9;
let hasMoreUsers = true; 

function onload_getUsers() {
    onload();
    getUsers(currentPage, limit);
}

function loadMoreUsers() {
    if (hasMoreUsers) { 
        currentPage++;
        getUsers(currentPage, limit);
    }
}

function goBack() {
    if (currentPage > 1) {
        currentPage--;
        getUsers(currentPage, limit);
    }
}

async function getUsers(page = 1, limit = 9) {
    try {
        const response = await fetch(`http://localhost:4000/users?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const usersData = await response.json();
        enterUsersTable(usersData.users, usersData.currentPage, limit);
        hasMoreUsers = usersData.users.length === limit;
        document.getElementById('loadMore').disabled = !hasMoreUsers;
    } 
    catch (error) {
        console.error('Error fetching users:', error);
    }
}

function enterUsersTable(users, currentPage, limit) {
    const usersTableBody = document.querySelector('#usersTable tbody');
    usersTableBody.innerHTML = '';

    users.forEach((user, index) => {
        const row = document.createElement('tr');
        const serialNumber = (currentPage - 1) * limit + index + 1; 
        row.innerHTML = `
            <td>${serialNumber}</td> <!-- Serial number column -->
            <td>${user.name || '------'}</td>
            <td>${user.email || '------'}</td>
            <td>${user.phone || '------'}</td>
            <td>${user.address || '------'}</td>
            <td>${user.city || '------'}</td>
            <td>${user.status !== undefined ? (user.status ? 'בעל עסק' : 'רגיל') : '------'}</td>
        `;
        usersTableBody.appendChild(row);
    });
}
