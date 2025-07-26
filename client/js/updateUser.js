
//טעינת העמוד
function initPage() {
    onload();       
    getUserData(); 
}

//שליפת פרטי המשתמש והכנסתם לעמוד
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
    } 
    catch (error) {
        console.error('Error loading user data:', error);
    }
}

//עדכון משתמש
function updateUser(){
    let id=localStorage.getItem('id');
    let name=document.getElementById('name').value;
    let password=document.getElementById('password').value;
    let email=document.getElementById('email').value;
    if (!name || !password || !email) {
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
            "email": email
        })
    }
    $.ajax(newuser)   
        .done(async function(response){  
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