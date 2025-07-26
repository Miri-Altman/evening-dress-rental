
//טעינת הדף
function onload_getDress(){
    onload();
    getDressForUser();
}

//קבלת שמלות למשתמש אישי
async function getDressForUser() {
    const userId = localStorage.getItem('id');
    try {
        const response = await fetch(`http://localhost:4000/users/getDressForUser?id=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();

        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>תמונה</th>
                <th>מחיר</th>
                <th>צבע</th>
                <th>מידות</th>
                <th>פידבק</th>
                <th>פעולות</th>
            </tr>
        `;
        userData.forEach(dress => {
            const row = table.insertRow();
            const urlImage=dress.image.substring(8);
            row.innerHTML = `
                <td><img src="${'../../server/uploads/'+urlImage}" style="width: 100px; height: auto;"></td>
                <td>${dress.price}</td>
                <td>${dress.color}</td>
                <td>${dress.size.join(', ')}</td>
                <td>${dress.feedback}</td>
                <td>
                    <button onclick="updateDress('${dress._id}')">עדכן</button>
                </td>
            `;
        });

        document.querySelector('main').appendChild(table);
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

//העברה לדף לעדכון שמלה
function updateDress(id) {
    window.location.href = `../html/addDress.html?dressId=${id}`;
}



