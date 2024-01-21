const apiUrl = "https://api.github.com/users/";
let currentPage = 1;
let reposPerPage = 10;


function fetchRepositories() {
    
    const username = document.getElementById("usernameInput").value;
    reposPerPage = parseInt(document.getElementById("reposPerPage").value);
    
    // if found empty user name then it will show error
    if (username.trim() === "") {
        alert("Please enter a GitHub username.");
        return;
    }

// call showLoader function to display a loading indicator
    showLoader();

// Fetch user information first
fetch(`${apiUrl}${username}`)
.then(response => response.json())
.then(userData => {
    // Update user profile picture and details
    updateUserInfo(userData);

    // Fetch repositories from GitHub API
    fetch(`${apiUrl}${username}/repos?per_page=${reposPerPage}&page=${currentPage}`)
        .then(response => response.json())
        .then(data => {
            hideLoader();
            displayRepositories(data);
            displayPagination(data.length);
        })
        .catch(error => {
            hideLoader();
            console.error("Error fetching repositories:", error);
        });
    })
    
}


function updateUserInfo(userData) {
    const profilePicture = document.getElementById("profile-picture");
    const userDetails = document.getElementById("user-details");

    // Set the user's profile picture
    profilePicture.src = userData.avatar_url;

    // Set the user details (name, location, twitter)
    userDetails.innerHTML = `<p>Name: ${userData.name || 'Not available'}</p>
                             <p>Bio goes here</p>
                             <p>Location: ${userData.location || 'Not available'}</p>
                             <p>Twitter: ${userData.twitter_username || 'Not available'}</p>`;
                             
                             
       
}


// display a loading indiacator by removing "d-done" class from an HTML element. 
function showLoader() {
    document.getElementById("loader").classList.remove("d-none");
}
// hides loader indicator by adding "d-done" calss
function hideLoader() {
    document.getElementById("loader").classList.add("d-none");
}

function displayRepositories(repositories) {
    //gets the container element from the repoitory
    const repositoriesContainer = document.getElementById("repositories");
    // clears its content
    repositoriesContainer.innerHTML = "";

    repositories.forEach(repository => {
        // Create a new <div> element for each repository
        const repositoryDiv = document.createElement("div");
        repositoryDiv.classList.add("repository");
       // Create an <h3> element for the repository name
        const repoName = document.createElement("h5");
        repoName.textContent = repository.name;
       // Create a <p> element for the repository topics
        const repoTopics = document.createElement("p");
        repoTopics.classList.add("topics");
        repoTopics.textContent = `Topics: ${repository.topics.join(", ")}`;
       // Append the repository name and topics elements to the repository <div>
        repositoryDiv.appendChild(repoName);
        repositoryDiv.appendChild(repoTopics);
       // Append the repository <div> to the main container for repositories
        repositoriesContainer.appendChild(repositoryDiv);
    });
}



function displayPagination(totalRepos) {
    //calculate the number og pages needed for pagination based on the total number
    const totalPages = Math.ceil(totalRepos / reposPerPage);
    //Retrieves the container element for pagination by its ID ("pagination").
    const paginationContainer = document.getElementById("pagination");
    //Clears any existing content inside the pagination container.
    paginationContainer.innerHTML = "";
// initiate a loop that itrate from 1 to total page
    for (let i = 1; i <= totalPages; i++) {
        // create span element for each pagination button
        const pageBtn = document.createElement("span");
        pageBtn.classList.add("pagination-btn", "btn", "btn-sm", "btn-outline-primary");
        // set the text content of the page button to current page
        pageBtn.textContent =`<< Page ${i}`;
        
        // set on click when the button is click it will update
        pageBtn.onclick = () => {
            //current page
            currentPage = i;
            //call fetchRepositories for display new page
            fetchRepositories();
        };
        //Appends the created pagination button (span element) to the pagination container.
        paginationContainer.appendChild(pageBtn);
        
    }
    //Create a "Next Page" button
    const nextPageBtn = document.createElement("span");
    nextPageBtn.classList.add("pagination-btn", "btn", "btn-sm", "btn-outline-primary");
    nextPageBtn.textContent = "Next Page >>";
    
    nextPageBtn.onclick = () => {
        // Increment the current page and fetch repositories
        currentPage++;
        fetchRepositories();
    };

    // Append the "Next Page" button to the pagination container
    paginationContainer.appendChild(nextPageBtn);

}

  function updatePagination(totalPages) {
    const paginationButtons = document.querySelectorAll(".pagination-btn");

    paginationButtons.forEach((button, index) => {
      if (index + 1 === currentPage) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }

// Initial call to displayPagination with a placeholder value
   
  fetchRepositories(); // Fetch rep





