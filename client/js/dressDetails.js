
//בטעינת הדף
function onload_loadDressDetails(){
    onload();
    loadDressDetails();
    StarRating();
}

//לקיחת פרטי שמלה מהעמוד הקודם
async function loadDressDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedDress = urlParams.get('dress');    
    if (!encodedDress) {
        console.error('No dress data provided');
        return;
    }
    const dress = JSON.parse(decodeURIComponent(encodedDress));
    displayDressDetails(dress);
}


function initializeStarRating() {
    StarRating(); 
}

//שמירת מספר כוכבים במעבר עליו
function StarRating() {
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;
    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.getAttribute('data-value'), 10);
            updateStars(selectedRating);
        });

        star.addEventListener('mouseover', () => {
            updateStars(parseInt(star.getAttribute('data-value'), 10));
        });

        star.addEventListener('mouseout', () => {
            updateStars(selectedRating);
        });
    });
}

// מעדכת צבע בכוכב במעבר עליו
function updateStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        if (parseInt(star.getAttribute('data-value'), 10) <= rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

//הוספת פידבק
async function addFeedback(dress) {
    const stars = document.querySelectorAll('.star');
    let selectedRating = Array.from(stars).filter(star => star.classList.contains('selected')).length;
    selectedRating = Math.floor(selectedRating); 
    if (!selectedRating) {
        alert("יש לבחור מספר כוכבים");
        return;
    }
    try {
        const response = await fetch('http://localhost:4000/dress/addFeedBack', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dressId: dress._id, feedback: selectedRating })
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            displayDressDetails(dress);
        } else {
            alert("תקלה, נסו שנית");
        }
    } catch (error) {
        console.error('Error adding feedback:', error);
        alert('שגיאה בהוספת פידבק');
    }
}

//הוספת תגובה
async function addtalkback(dress) {
    const talkbackText = document.getElementById('talkback-text').value;
    if (!talkbackText.trim()) {
        alert("נא להכניס חוות דעת לפני שליחה.");
        return;
    }
    try {
        const response = await fetch('http://localhost:4000/dress/addTalkBack', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dress, talkBack: talkbackText })
            });
        if (response.ok) {     
            const result = await response.json();
            alert(result.message);
            displayDressDetails(dress);
        }
        else{
            alert("תקלה, נסו שנית")
        }
    } 
    catch (error) {
        console.error('Error adding talkback:', error);
        alert('שגיאה בהוספת פידבק');
    }
}

//הצגת פרטי שמלה
function displayDressDetails(dress) {
    const container = document.getElementById('dress');
    const urlImage = dress.image.substring(8);
    let stars = '';
    for (let i = 0; i < dress.feedback; i++) {
        stars += '<i class="full_star">&#9733;</i>'; // כוכב מלא
    }
    for (let i = dress.feedback; i < 5; i++) {
        stars += '<i class="empty_star">&#9733;</i>'; // כוכב ריק
    }    
    // יצירת רשימת פידבק
    const feedbackList = dress.talkBack.map(item => `<p class="feedback">${"👍"+item}</p>`).join('');
    const addtalkbackButton = `<button type="button" id="add-talkback" onclick='addtalkback(${JSON.stringify(dress)})'>הוסף חוות דעת</button>`;
    const addfeedbackButton = `<button type="button" id="add-feedback" onclick='addFeedback(${JSON.stringify(dress)})'>הוסף דירוג</button>`;
    container.innerHTML = `
        <img src="${'../../server/uploads/' + urlImage}" alt="Dress Image" class="dress-image">
        <div class="dress-details">
            <p><i class="fas fa-tshirt"></i>מידות: ${Array.isArray(dress.size) ? dress.size.join(', ') : 'מידות לא זמינות'}</p>
            <p><i class="fas fa-money-bill-wave"></i>₪ מחיר: ${dress.price} ₪</p>
            <p><i class="fas fa-map-marker-alt"></i> כתובת: ${dress.userData.address}, ${dress.userData?.city || 'לא ידוע'}</p>
            <p><i class="fas fa-map-marker-alt"></i>✉️ מייל: ${dress.userData.email}</p>
            <p><i class="fas fa-phone-alt"></i>☎️ טלפון: ${localStorage.getItem('status')? dress.userData.phone: 'יש להתחבר כדי לראות מספר טלפון'}</p>
            
            <div class="stars">
                ${stars}
            </div>
            <h3>הוסף דירוג:</h3>
            <div class="rating">
                <span class="star" data-value="1">&#9733;</span>
                <span class="star" data-value="2">&#9733;</span>
                <span class="star" data-value="3">&#9733;</span>
                <span class="star" data-value="4">&#9733;</span>
                <span class="star" data-value="5">&#9733;</span>
            </div>
            ${addfeedbackButton}
            <div>
                <h3>חוות דעת:</h3>
                ${feedbackList}
                <div class="talk_back">
                    <textarea id="talkback-text" placeholder="הזן את חוות הדעת שלך כאן"></textarea>
                    ${addtalkbackButton}
                </div>
            </div>

        </div>
    `;
}




