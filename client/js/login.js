
//התחברות
function login(){
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    localStorage.removeItem('status');
    let name=document.getElementById('name').value;
    let password=document.getElementById('password').value;
    if (!name || !password) {
        alert('אנא מלא את כל השדות הנדרשים');
        return;
    }
    var currentUser={
        "url":"http://localhost:4000/users/login",
        "method": "POST",
        "headers":{
            "Content-Type": "application/json"
        },
        "data" :JSON.stringify({
            "name": name,
            "password": password
        })
    }
    $.ajax(currentUser)    
        .done(async function(response){  
            localStorage.setItem("token",response.token);
            localStorage.setItem("id",response.user._id);
            localStorage.setItem("name",response.user.name);
            localStorage.setItem("status",response.user.status);
            if(response.user.password=="98999"){
                localStorage.setItem("direc","true");
            }
            window.location.href ="../html/home.html";
            alert("התחברת");
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log("Status Code:", jqXHR.status); 
            console.log("Response Text:", jqXHR.responseText);
            console.log("Response JSON:", jqXHR.responseJSON); 
            
            alert(jqXHR.responseText);
        })
}

//העברה להרשמה
function moveRegister(){
    window.location.href="../html/register.html"
}