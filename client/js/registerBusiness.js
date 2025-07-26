
//הוספת עסק
function addUser(){
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
        "method": "POST",
        "headers":{
            "Content-Type": "application/json"
        },
        "data" :JSON.stringify({
            "name": name,
            "password": password,
            "email": email,
            "phone":phone,
            "address":address,
            "city":city,
            "status" :true
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