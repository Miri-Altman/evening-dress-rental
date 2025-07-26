
//טעינת העמוד
function initPage() {
    onload();
    getUserData(); 
}

//הכנסת פרטי המשתמש לעמוד
async function getUserData() {
    const userId = localStorage.getItem('id');  
    try {
        const response = await fetch(`http://localhost:4000/users/getUsersById?id=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        document.getElementById('name').value = userData.name || '';
        document.getElementById('email').value = userData.email || '';
        document.getElementById('password').value = userData.password || '';
        document.getElementById('phone').value = userData.phone || '';
        document.getElementById('address').value = userData.address || '';
        const city = document.querySelector(`#citySelect input[type="radio"][value="${userData.city}"]`);
        if (city) {
            city.checked = true;
        }
    } 
    catch (error) {
        console.error('Error loading user data:', error);
    }
}

//עדכון עסק
function updateBusiness(){
    let id=localStorage.getItem('id');
    let name=document.getElementById('name').value;
    let password=document.getElementById('password').value;
    let email=document.getElementById('email').value;
    let phone=document.getElementById('phone').value;
    let address=document.getElementById('address').value;
    let city = document.querySelector('#citySelect input[type="radio"]:checked').value;

    if (!name || !password || !email || !phone || !address || !city) {
        alert('אנא מלא את כל השדות הנדרשים');
        return;
    }
    var newuser={
        "url":"http://localhost:4000/users",
        "method": "PUT",
        "headers":{
            "Content-Type": "application/json"
        },
        "data" :JSON.stringify({
            "_id":id,
            "name": name,
            "password": password,
            "email": email,
            "phone":phone,
            "address":address,
            "city":city,
        })
    }
    $.ajax(newuser)   
        .done(async function(response){  
            console.log(response);
            localStorage.setItem("name",response.user.name);
            window.location.href ="../html/home.html";
            alert("הפרטים עודכנו בהצלחה");
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log("Status Code:", jqXHR.status); 
            console.log("Response Text:", jqXHR.responseText);
            console.log("Response JSON:", jqXHR.responseJSON);
            
            alert(jqXHR.responseText);
        })
}