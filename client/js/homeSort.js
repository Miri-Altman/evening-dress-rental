
//סימון ושמירת הצבע
let selectedColor=null;
function colorClick(element) {
    if (selectedColor) {
        selectedColor.classList.remove('selected');
    }
    selectedColor = element;
    selectedColor.classList.add('selected');
    const colorValue = selectedColor.style.backgroundColor;
}

//סימון ושמירת פידבק-כוכבים
let feedback=null;
function StarRating() {
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = star.getAttribute('data-value');
            updateStars(selectedRating);
            document.querySelector('p').textContent = `בחרת ${selectedRating} כוכבים`;
            feedback=selectedRating;
        });        
        star.addEventListener('mouseover', () => {
            updateStars(star.getAttribute('data-value'));
        });
        star.addEventListener('mouseout', () => {
            updateStars(selectedRating);
        });
    });
}

//עדכון כוכב בעת לחיצה
function updateStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        if (parseInt(star.getAttribute('data-value')) <= rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

//מיון לפי צבע
async function SortByColor(page=1, limit=9){
    whichSort="color"
    const selectedColorElement = document.querySelector('.color-option.selected');
    const selectedColor=selectedColorElement.title;
    if(!selectedColor){
        alert("יש לבחור צבע");
    }
    try {
        const response = await fetch(`http://localhost:4000/dress/getByColor?color=${selectedColor}&page=${page}&limit=${limit}`);
        const {dresses, totalPages}=await response.json();
        if(!dresses){
            alert("לא נמצאו שמלות בצבע זה");
            onload_getDress();
            return;            
        }
        displayDresses(dresses);
        checkPages(page,totalPages);
    } 
    catch (error) {
        console.error('Error loading user data:', error);
    }    
}

//מיון לפי מחיר
async function SortByPrice(page=1, limit=9){
    whichSort="price"
    const minPrice = document.querySelector('#minPrice').value;
    const maxPrice = document.querySelector('#maxPrice').value;
    if(!minPrice || !maxPrice){
        alert("יש לבחור מחיר מינמלי ומקסימלי");
    }
    try {
        const response = await fetch(`http://localhost:4000/dress/getByPrice?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&limit=${limit}`);
        const {dresses, totalPages}=await response.json();
        if(!dresses){
            alert("לא נמצאו שמלות במחיר זה");
            onload_getDress();
            return;            
        }
        displayDresses(dresses);
        checkPages(page,totalPages);
    } 
    catch (error) {
        console.error('Error loading user data:', error);
    }    
}

//מיון לפי מידה
async function SortBySize(page=1, limit=9){
    whichSort="size"
    const sizeInputs = document.querySelectorAll('.chooseSize');
    const selectedSizes = [];   
    sizeInputs.forEach(input => {
        const sizeValue = parseInt(input.value, 10);    
        if (sizeValue > 0) {
            for (let i = 0; i < sizeValue; i++) {
                selectedSizes.push(parseInt(input.id, 10));
            }
        }
    }); 
    if(selectedSizes.length==0){
        alert("יש לבחור לפחות מידה אחת");
    }
    try {
        const querySizes = selectedSizes.map(size => `sizes=${size}`).join('&');
        const response = await fetch(`http://localhost:4000/dress/getByCountSize?${querySizes}&page=${page}&limit=${limit}`);
        const {dresses, totalPages}=await response.json();
        if(!dresses){
            alert("לא נמצאו שמלות במידה זו");
            onload_getDress();
            return;            
        }
        displayDresses(dresses);
        checkPages(page,totalPages);
    } 
    catch 
    (error) {
        console.error('Error loading user data:', error);
    }    
}

//מיון לפי פידבק
async function SortByFeedback(page=1, limit=9){
    whichSort="feedBack"
    if(!feedback){
        alert("יש לבחור מספר כוכבים");
    }
    try {
        const response = await fetch(`http://localhost:4000/dress/getByFeedback?feedback=${feedback}&page=${page}&limit=${limit}`);
        const {dresses, totalPages}=await response.json();
        if(!dresses){
            alert("לא נמצאו שמלות עם דרוג זה");
            onload_getDress();
            return;            
        }
        displayDresses(dresses);
        checkPages(page,totalPages);
    } 
    catch (error) {
        console.error('Error loading user data:', error);
    }    
}

//מיון לפי איזור
async function SortByCity(page=1, limit=9){
    whichSort="area"
    let cityChoose = document.querySelector('#citySelect input[type="radio"]:checked');
    if (cityChoose) {
        var selectedCity = cityChoose.value;
    }
    if(!selectedCity){
        alert("יש לבחור איזור");
        return;
    }
    try {
        const response = await fetch(`http://localhost:4000/dress/getDressByCity?city=${selectedCity}&page=${page}&limit=${limit}`);
        const {dresses, totalPages}=await response.json();
        if(!dresses){
            alert("לא נמצאו שמלות באזור זה");
            onload_getDress();
            return;            
        }
        displayDresses(dresses);
        checkPages(page,totalPages);
    } 
    catch (error) {
        console.error('Error loading user data:', error);
    }    
}

