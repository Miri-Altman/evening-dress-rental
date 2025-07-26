
//הוספת משתמש
function addUser(){
    let name=document.getElementById('name').value;
    let password=document.getElementById('password').value;
    let email=document.getElementById('email').value;
    if (!name || !password || !email) {
        alert('אנא מלא את כל השדות הנדרשים');
        return;
    }
    var newuser={
        "url":"http://localhost:4000/users",
        "method": "POST",
        "headers":{
            "Content-Type": "application/json"
        },
        "data" :JSON.stringify({
            "name": name,
            "password": password,
            "email": email,
            "status": false
        })
    }
    $.ajax(newuser)
        .done(async function(response){
            localStorage.setItem("token",response.token);
            localStorage.setItem("id",response.user._id);
            localStorage.setItem("name",response.user.name);
            localStorage.setItem("status",response.user.status);
            window.location.href ="../html/home.html";
            alert("נרשמת בהצלחה");
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log("Status Code:", jqXHR.status);
            console.log("Response Text:", jqXHR.responseText);
            console.log("Response JSON:", jqXHR.responseJSON);            
            alert(jqXHR.responseText);
        })
}