document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const searchForm = document.querySelector('.search-form')
    const imageGrid = document.querySelector('.images');
    const pagination = document.querySelector(".pagination");
    const perPage = 16; 
    let query = '';
    let currentPage = 1;
    let totalPages = 0;


    // Function to fetch images from Flickr API
    async function fetchImages(query, page) {
        const response = await fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=71b1966355ddca4fec1345cac864a220&text=${query}&format=json&nojsoncallback=1&extras=url_s&page=${page}&per_page=${perPage}`);
        const data = await response.json();
        totalPages = Math.ceil(data.photos.total / perPage);    
        return data.photos.photo;
    }
    
    function renderImages(images) {
        imageGrid.innerHTML = "";
        images.forEach(image => {
            const imgCard = document.createElement("div");
            imgCard.classList.add('card');

            const imgCardHeader = document.createElement('div');
            imgCardHeader.classList.add('card-header');
            imgCardHeader.textContent = `Image ID: ${image.id}`;
            imgCard.appendChild(imgCardHeader);
            console.log("Image ID: " +  image.id);

            const imgCardBody = document.createElement('div');
            imgCardBody.classList.add('card-body');
            const imgElement = document.createElement("img");
            imgElement.src = image.url_s;
            imgElement.alt = image.title;
            imgCardBody.appendChild(imgElement);
            imgCard.appendChild(imgCardBody);
            console.log("Image URL: " +  image.url_s);

            // create a link to open the image in a new tap 
            imgCardBody.addEventListener('click', () => {
                window.open(image.url_s, "_blank");
            })

            // create a hover affect on the image 
            imgCardBody.addEventListener("mouseenter", () => {
                if(imgCardBody.width === imgCard.width){
                    imgCard.style.transform = "scale(1.05)";
                    imgCardBody.style.transform = "scale(1.05)"; 
                    imgCardBody.style.cursor = "pointer";
                } else {
                    imgCardBody.style.transform = "scale(1.05)"; 
                }
                
            });
            imgCardBody.addEventListener("mouseleave", () => {
                imgCard.style.transform = "scale(1)";
                imgCardBody.style.transform = "scale(1)"; 
            });

            const imgCardText = document.createElement("div");
            imgCardText.classList.add("card-text");
            imgCardText.textContent = `${image.title}`;
            imgCard.appendChild(imgCardText);
            console.log("Title: " + image.title);

            imageGrid.appendChild(imgCard);
        });
    }

    // function to compute the number if the buttons inside the pagination and render them
    function handlePagination() {
        pagination.innerHTML = '';
    
        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                searchImages();
            }
        });
        pagination.appendChild(prevButton);
    
        // Page buttons
        const totalPagesToShow = Math.min(totalPages, 10);
        let startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + totalPagesToShow - 1);
        if (endPage - startPage < totalPagesToShow - 1) {
            startPage = Math.max(1, endPage - totalPagesToShow + 1);
        }
    
        if (startPage > 1) {
            const firstPageButton = document.createElement('button');
            firstPageButton.textContent = '1';
            firstPageButton.addEventListener('click', () => {
                currentPage = 1;
                searchImages();
            });
            pagination.appendChild(firstPageButton);
            if (startPage > 2) {
                pagination.appendChild(document.createTextNode('...'));
            }
        }
    
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                searchImages();
            });
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pagination.appendChild(pageButton);
        }
    
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pagination.appendChild(document.createTextNode('...'));
            }
            const lastPageButton = document.createElement('button');
            lastPageButton.textContent = totalPages;
            lastPageButton.addEventListener('click', () => {
                currentPage = totalPages;
                searchImages();
            });
            pagination.appendChild(lastPageButton);
        }
    
        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                searchImages();
            }
        });
        pagination.appendChild(nextButton);
    }
    

    // Function to handle form submission
    function handleFormSubmit(event) {
        event.preventDefault();
        query = searchInput.value.trim();
        currentPage = 1;
        searchImages();
    }
    
    // Function to handle search
    function searchImages() {
        let query = searchInput.value.trim();
        fetchImages(query, currentPage)
            .then(images => {
                renderImages(images);
                handlePagination(totalPages, currentPage);
            })
            .catch(error => {
                console.error("Error fetching images:", error);
            });
    }

    // Event listener for search button click
    searchButton.addEventListener("click", handleFormSubmit);

    // Event listener for form submission
    searchForm.addEventListener("submit", handleFormSubmit);

    // I have commented this part to only show pictures after making a search for somthing 
    // Initial search on page load
    // fetchImages();
});