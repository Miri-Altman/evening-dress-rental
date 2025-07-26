//משתנים גלובלים
let currentPage = 1;
const limit = 9;
let whichSort="all";

//טעינת הדף
function onload_getDress(){
   onload();
   getDress(); 
   StarRating()
}

//ניקוי העמוד
function clearPage(){
    window.location.href = `../html/home.html`;
}

//קבלת כל השמלות
async function getDress(page=1, limit=9) {
    whichSort="all"
    try {
        const response = await fetch(`http://localhost:4000/dress?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const {dress, totalPages}=await response.json();
        displayDresses(dress);
        checkPages(page,totalPages);
    } 
    catch (error) {
        console.error('Error loading user data:', error);
    }
}

//הצגת שמלה על בדף
async function displayDresses(dresses) {
    const container = document.querySelector('.dress-container');
    const dressPromises = dresses.map(async dress => {
        try {
            const responseUser = await fetch(`http://localhost:4000/users/getUsersById?id=${dress.businessID}`);
            if (!responseUser.ok) {
                throw new Error(`Failed to fetch user data for businessID ${dress.businessID}`);
            }
            const userData = await responseUser.json();
            dress.userData = userData;
            return dress;
        } catch (error) {
            console.error('Error loading user data:', error);
            return dress;
        }
    });
    const dressesWithUserData = await Promise.all(dressPromises);
    container.innerHTML = dressesWithUserData.map(dress => {
        const urlImage = dress.image.substring(8);
        return `
            <div class="dress-card" onclick='viewDressDetails(${JSON.stringify(dress)})'>
                <img src="${'../../server/uploads/' + urlImage}" alt="Dress Image">
                <div class="dress-details">
                    <p>${dress.userData?.name || 'לא ידוע'}</p>
                    <p>${dress.price} ₪</p>
                    <p>מידות: ${dress.size.join(', ')}</p>
                    <p>${dress.userData?.address || 'לא ידוע'}  ${dress.userData?.city || 'לא ידוע'}</p>
                </div>
            </div>
        `;
    }).join('');
}

//טען עוד
function loadMoreDresses() {
    currentPage++;
    if(whichSort=="area"){
        SortByCity(currentPage, limit);
    }
    else if(whichSort=="color"){
        SortByColor(currentPage, limit);
    }
    else if(whichSort=="price"){
        SortByPrice(currentPage, limit);
    }
    else if(whichSort=="size"){
        SortBySize(currentPage, limit);
    }
    else if(whichSort=="feedBack"){
        SortByFeedback(currentPage, limit);
    }
    else{
        getDress(currentPage, limit);
    }
}

//חזרה לעמוד קודם
function goBack() {
    currentPage--;
    if(whichSort=="area"){
        SortByCity(currentPage, limit);
    }
    else if(whichSort=="color"){
        SortByColor(currentPage, limit);
    }
    else if(whichSort=="price"){
        SortByPrice(currentPage, limit);
    }
    else if(whichSort=="size"){
        SortBySize(currentPage, limit);
    }
    else if(whichSort=="feedBack"){
        SortByFeedback(currentPage, limit);
    }
    else{
        getDress(currentPage, limit);
    }
}

//בדיקת דפדוף
function checkPages(page,totalPages){
    if(page==1){
        document.getElementById('goBack').style.display='none'
    }
    else{
        document.getElementById('goBack').style.display='block' 
    }
    if (page >= totalPages) {

        document.getElementById('loadMore').style.display = 'none';
    } 
    else {
        document.getElementById('loadMore').style.display = 'block';
    }
}

//העברת פרטי השמלה לדף השמלה הספציפית
function viewDressDetails(dress) {
    const encodedDress = encodeURIComponent(JSON.stringify(dress));
    window.location.href = `../html/dressDetails.html?dress=${encodedDress}`;
}

