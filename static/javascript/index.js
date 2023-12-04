document.addEventListener('DOMContentLoaded', function () {
    
    fetch('/server/view')
        .then(response => response.json())
        .then(data => {
            const cardContainer = document.getElementById('card-container');

            data.forEach((card, index) => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.id = `card-${index}`;

                var ratingList = [0,0,0,0,0];
                var x = card.rating;

                for(var i=0; i<5; i++){
                    if(x >= 1){
                        ratingList[i] = 'full-star';
                    }
                    else if(x == 0.5){
                        ratingList[i] = 'half-star';
                    }
                    else{
                        ratingList[i] = 'empty-star';
                    }
                    x--;
                }

                var isHide = card.hide ? 1 : 0;
                var isShortlist = card.shortlist ? 1 : 0;

                cardElement.innerHTML = `
                    <div class="card-details">
                        <div class="content-1">
                            <p class="heading">${card.name}</p>
                        </div>

                        <div class="content-2 rating">
                            <img src="/static/images/card/${ratingList[0]}.svg" alt="${ratingList[0]}">
                            <img src="/static/images/card/${ratingList[1]}.svg" alt="${ratingList[1]}">
                            <img src="/static/images/card/${ratingList[2]}.svg" alt="${ratingList[2]}">
                            <img src="/static/images/card/${ratingList[3]}.svg" alt="${ratingList[3]}">
                            <img src="/static/images/card/${ratingList[4]}.svg" alt="${ratingList[4]}">
                        </div>

                        <div class="content-3">
                            <p class="description">${card.description}</p>
                        </div>

                        <div class="content-4">
                            <div class="projects">
                                <p class="value">${card.projects}</p>
                                <p class="name">Project</p>
                            </div>
                
                            <div class="experience">
                                <p class="value">${card.experience}</p>
                                <p class="name">Years</p>
                            </div>
                
                            <div class="price">
                                <p class="value">${card.price}</p>
                                <p class="name">Price</p>
                            </div>
                        </div>

                        <div class="content-5">
                            <p class="number-1">${card.contacts[0]}</p>
                            <p class="number-2">${card.contacts[1]}</p>
                        </div>
                    </div>

                    <div class="btns">
                        <div class="details">
                            <a href="#">
                                <img src="/static/images/card/details.svg" alt="details">
                                <p>Details</p>  
                            </a>
                        </div>

                        <div class="hide">
                            <a href="#">
                                <img src="/static/images/card/hide-${isHide}.svg" alt="hide">
                                <p>Hide</p>  
                            </a>
                        </div>

                        <div class="shortlist">
                            <a style="cursor: pointer;">
                                <img id="shortlist-icon-${index}" class="shortlist-${isShortlist}" src="/static/images/card/shortlist-${isShortlist}.svg" alt="shortlist">
                                <p>Shortlist</p>  
                            </a>
                        </div>

                        <div class="report">
                            <a href="#">
                                <img src="/static/images/card/report.svg" alt="report">
                                <p>Report</p>  
                            </a>
                        </div>
                    </div>
                `

                cardContainer.appendChild(cardElement);
            });

            const shortlistBtns = document.querySelectorAll('.shortlist a');
        
            // Shortlist toggle functionality
            shortlistBtns.forEach((button, index) => {
                button.addEventListener('click', () => {
                    toggleShortlist(index);
                    shortlistMessage();
                });
            });
        
            function toggleShortlist(index) {
                const shortlistIcon = document.getElementById(`shortlist-icon-${index}`);
                const card = document.getElementById(`card-${index}`);
        
                data[index].shortlist = 1 - data[index].shortlist;
        
                if(data[index].shortlist === 1) {
                    shortlistIcon.src = "/static/images/card/shortlist-1.svg";
                    shortlistIcon.classList.add("shortlist-1");
                    shortlistIcon.classList.remove("shortlist-0");
                } 
                else {
                    shortlistIcon.src = "/static/images/card/shortlist-0.svg";
                    shortlistIcon.classList.add("shortlist-0");
                    shortlistIcon.classList.remove("shortlist-1");
                }
        
                // Check if the shortlist filter is active
                if (shortlistNavBtn.classList.contains('active')) {
                    card.style.display = data[index].shortlist === 1 ? "flex" : "none";
                }

                // Updating shortlist value of card in database
                const shortlistData = {
                    id : data[index].id,
                    shortlist: data[index].shortlist,
                };

                const csrfToken = getCookie('csrftoken');

                fetch('server/update-shortlist/', {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    body: JSON.stringify(shortlistData)
                });
            }
            
            // Shortlisted filter toggle functionality
            const shortlistNavBtn = document.querySelector('.shortlist-nav-icon');
        
            shortlistNavBtn.addEventListener('click', () => {
                toggleShortlistFilter();
                shortlistMessage();
            });
        
            function toggleShortlistFilter() {
                if(shortlistNavBtn.classList.contains('active')){
                    shortlistNavBtn.src = "/static/images/navbar/shortlisted-0.svg";
                }
                else{
                    shortlistNavBtn.src = "/static/images/navbar/shortlisted-1.svg";
                }
        
                shortlistNavBtn.classList.toggle('active');
        
        
                // Update the display of each card based on the shortlist filter
                data.forEach((card, index) => {
                    const cardElement = document.getElementById(`card-${index}`);
        
                    if(shortlistNavBtn.classList.contains('active')) {
                        // If the filter is active, hide or show the card based on shortlist status
                        cardElement.style.display = card.shortlist == 1 ? "flex" : "none";
                    } 
                    else {
                        // If the filter is inactive, always show the card
                        cardElement.style.display = "flex";
                    }
                });
            }
        
            // Check if there are any designers that are shortlisted or not
            function shortlistMessage() {
                const shortlistedCards = data.filter(card => card.shortlist == 1);
                
                if (shortlistNavBtn.classList.contains('active') && shortlistedCards.length === 0) {
                    // If the filter is active and there are no shortlisted cards, show a message
                    document.getElementById('shortlisted-message').style.display = 'block';
                } 
                else {
                    // Otherwise, hide the message
                    document.getElementById('shortlisted-message').style.display = 'none';
                }
            }
        });
});

// Function to get the CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');

        for (let i=0; i <cookies.length; i++) {
            const cookie = cookies[i].trim();

            // Check if this cookie string begins with the name we want
            if (cookie.substring(0, name.length + 1) === name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    
    return cookieValue;
}