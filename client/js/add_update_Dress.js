
//בטעינת הדף
function onload_business(){
    onload();
    const id=localStorage.getItem('id');
    if(!id){
        alert("יש להתחבר טרם הוספת שמלה");
        window.location.href="../html/login.html";
        return;
    }
    if(localStorage.getItem('status')=="false"){
        alert("יש להרשם כבעל עסק");
        window.location.href="../html/registerBusiness.html";
        return;
    }
    //בדיקה האם הדף משמש כהוספה או עדכון
    const urlParams = new URLSearchParams(window.location.search);
    const dressId = urlParams.get('dressId');
    if (dressId) {
        DressData(dressId);
    }
}

// פונקציה כללית שמבצעת הוספה או עדכון בהתאם למצב
async function addOrUpdateDress() {
    const urlParams = new URLSearchParams(window.location.search);
    const dressId = urlParams.get('dressId');
    if (dressId) {
        await updateDress();
    }
    else {
        await addDress();
    }
}

//לשמירה וסימון הצבע הנבחר
let selectedColor=null;
function colorClick(element) {
    if (selectedColor) {
        selectedColor.classList.remove('selected');
    }
    selectedColor = element;
    selectedColor.classList.add('selected');
    const colorValue = selectedColor.style.backgroundColor;
}

//להוספת שמלה
async function addDress() {    
    const selectedColorElement = document.querySelector('.color-option.selected');
    const price = document.querySelector('#price').value;
    const imageFile = document.querySelector('#image').files[0];
    const sizeInputs = document.querySelectorAll('.chooseSize');
    
    if(!selectedColorElement || !price || !imageFile || !sizeInputs){
        alert('אנא מלא את כל השדות הנדרשים');
        return;
    }
    const selectedColorNew=selectedColorElement.title;
    const sizes = [];
    
    sizeInputs.forEach(input => {
        const size = input.id;
        const quantity = input.value;
        for (let i = 0; i < quantity; i++) {
            sizes.push(size);
        }
    });    
    const token = localStorage.getItem('token');
    const businessID = localStorage.getItem('id');
    const formData = new FormData();
    formData.append('color', selectedColorNew);
    formData.append('price', parseInt(price, 10));
    sizes.forEach(size => formData.append('size', size));
    if (imageFile) {
        formData.append('image', imageFile);
    }
    formData.append('_id', businessID);

    try{
        const currentDress=await fetch('http://localhost:4000/dress',{
            method: 'POST',
            body: formData
        });
        const data=await currentDress.json();
        if(currentDress.ok){
            alert("השמלה נוספה בהצלחה");
            window.location.href = "../html/home.html";
        }
        else{
            alert(data.message);
        }
    }
    catch(error){
        console.error(error);
    }  
}


//לקיחת פרטי השמלה כאשר העמוד עומד על עדכון
async function DressData(dressId) {
    try {
        const response = await fetch(`http://localhost:4000/dress/getById?id=${dressId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch dress data');
        }
        const dress = await response.json();
        EnterDressDetails(dress);
    } 
    catch (error) {
        console.error('Error fetching dress data:', error);
    }
}

//השמת פרטי השמלה לעדכון
let urlImage=""
function EnterDressDetails(dress) {
    document.getElementById('submitButton').textContent = 'עדכון שמלה';
    document.querySelector('#price').value = dress.price;
    const sizeInputs = document.querySelectorAll('.chooseSize');
    sizeInputs.forEach(input => {
    const size = parseInt(input.id, 10); // המרת ה-id למספר
    const count = dress.size.filter(s => s === size).length;
    input.value = count;
    });

    const colorElement = Array.from(document.querySelectorAll('.color-option')).find(el => el.title === dress.color);
    if (colorElement) {
        colorClick(colorElement);
    }
    console.log(dress.image);
    alert(dress.image)
    urlImage=dress.image;
    const imagePreview = document.querySelector('#imagePreview');
    imagePreview.src = `../../server/${urlImage}`;
    imagePreview.style.display = 'block';
}

// פונקציה לעדכון שמלה קיימת
async function updateDress() {
    const selectedColorElement = document.querySelector('.color-option.selected');
    const price = document.querySelector('#price').value;
    const imageFile = document.querySelector('#image').files[0];
    const sizeInputs = document.querySelectorAll('.chooseSize');
    
    if (!selectedColorElement || !price || !sizeInputs) {
        alert('אנא מלא את כל השדות הנדרשים');
        return;
    }
    //שליפת צבע
    const selectedColorNew = selectedColorElement.title;
    //שליפת מידה
    const sizes = [];    
    sizeInputs.forEach(input => {
        const size = parseInt(input.id, 10);
        const quantity = input.value;
        for (let i = 0; i < quantity; i++) {
            sizes.push(size);
        }
    });
    //שליפת id
    const dressId = new URLSearchParams(window.location.search).get('dressId');
    const formData = new FormData();
    formData.append('color', selectedColorNew);
    formData.append('price', parseInt(price, 10));
    sizes.forEach(size => formData.append('size', size));
    formData.append('_id', dressId);
     //שליפת תמונה
    if(imageFile){
        formData.append('image', imageFile);
    }
    else{
        formData.append('image', urlImage);
    }
    try {
        const response = await fetch('http://localhost:4000/dress', {
            method: 'PUT',
            body: formData
        });     
        const data = await response.json();
        if (response.ok) {
            alert("השמלה עודכנה בהצלחה");
            window.location.href = "../html/myDress.html";
        } 
        else {
            alert(data.message);
        }
    } 
    catch (error) {
        console.error(error);
    }
}


