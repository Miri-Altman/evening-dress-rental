

//בטעינת כל הדפים
function onload(){
    document.getElementById("getAllUsers").style.display="none";
    if(localStorage.getItem('direc')=="true"){
        document.getElementById("getAllUsers").style.display="block";
    }
    if(localStorage.getItem('name')){
        document.getElementById("userName").innerHTML = "שלום ל" + localStorage.getItem('name');
        if(localStorage.getItem('status')=="false"){
            document.getElementById("myDress").style.display="none";
        }
    }
    else{
        document.getElementById("logout").style.display="none";
        document.getElementById("updateUser").style.display="none";
        document.getElementById("myDress").style.display="none";
    }
}

//העברת לצפיה בשמלות של עסק מסוים
function myDress(){
    window.location.href="../html/myDress.html";
}

//התנתקות
function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    localStorage.removeItem('status');
    localStorage.removeItem('direc');
    window.location.href="../html/home.html"
}

//עדכון משתמש
function updateUser(){
    if(localStorage.getItem('status')=="true"){
        window.location.href="../html/updateBusiness.html";
    }
    else{
        window.location.href="../html/updateUser.html";
    }
}

//קבלת כל המשתמשים למנהל בלבד
function getAllUsers(){
    window.location.href="../html/manager.html";
}
