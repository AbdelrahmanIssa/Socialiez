import {
  changeUI,
  getCurrentUser,
  showAlert,
  logOutSubmit,
  loginSubmit,
  registerSubmit,
  loaderToggler
} from "./main.js";

// Call the changeUI function to update the UI based on authentication status
changeUI();
const baseUrl = "https://tarmeezacademy.com/api/v1/";
// Extract post ID from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");


displayPost();
// Function to display post details
export async function displayPost() {
  try {
    // Show loader while fetching post details
    loaderToggler(true);

    // Fetch post details using Axios
    const response = await axios.get(`${baseUrl}posts/${postId}`);
    const post = await response.data.data;
    const comments = await post.comments;
    const author = await post.author;

    // Update DOM with post author's username
    document.getElementById("userNameSpan").innerHTML = author.username;

    // Initialize an empty string to store comment HTML content
    let commentContent = ``;

    // Loop through comments and generate HTML content for each
    for (const comment of comments) {

      commentContent += `
      <div class="card-footer pt-2 border-bottom">
        <div class="d-flex justify-content-between" >
        <div>
          <img id="commentImg" src="${
            isValidURL(comment.author.profile_image)
              ? post.image
              : "images/page-not-found.webp"
          }" class="rounded-circle profilePic" >
          <span class="mt-3 text-l">${comment.author.username}</span>
          </div>
          <span class="mt-3  text-opacity-25 fa-xs ">at ${comment.author.created_at.slice(
            11,
            16
          )}</span>
        </div>
        <p class='p-1 mb-0 marginZero'>${comment.body}</p>
      </div>
      `;
    }
    // Extract post title or set it to an empty string if undefined
    const postTitle = post.title || "";

    // Function to check if a URL is valid
    function isValidURL(url) {
      try {
        new URL(url);
        return true;
      } catch (error) {
        return false;
      }
    }

    // HTML content for the post
    const content = `
           <div class="card shadow mb-4 ">
           <div class="card-header d-flex align-items-center">
           <div>
           <span class="moveToProfilePage mx-1 font-weight-bolder " data-user-id="${author.id}"  >
           <a href="#" aria-label="user Profile Pic"><img id="userProfilePic" class="profilePic rounded-circle border border-2" alt="Profile pic" src="
           ${
             Object.entries(post.author.profile_image).length === 0
               ? `./images/1.webp`
               : `${post.author.profile_image}`
           }" > </a>
          <span class="userNameCapitalize">
                ${author.username}
          </span>
            </span>
            </div>
            <div>
          </div>
           </div>
           <div  class=" card-body pt-3">
            <img id="postImg" class="imgPost w-100 rounded mb-1" src="${
              isValidURL(post.image)
                ? post.image
                : "images/page-not-found.webp"
            }"   alt="postImg">
             <b class="text-secondary fw-light fs-6">${post.created_at}</b>
             <h5 class="card-title">${postTitle}</h5>
             <p class="card-text">${post.body}</p>
             <div class="card-footer bg-white pe-0 pt-0 ">
             <div class="col-12 d-flex justify-content-center py-3 mb-3 commentsNumber rounded">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
             <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894m-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
             </svg>
             <span class="mx-2">
             (${post.comments_count}) Comments
              </span>
              </div>
             </div>
             <div id="comments">
             ${commentContent}
           </div>
           <div id='addNewComment'>
           <div class="input-group my-2">
             <input id="commentInput"  type="text" placeholder="Add your comments here" class="form-control rounded p-2 me-2">
             <button id="addNewCommentBtn" class="btn bg-transparent p-0 m-0 addCommentBtn" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#1E6B6B"
             class="bi bi-plus-circle-fill text-primary " viewBox="0 0 16 16" aria-label="add new comment">
             <path
               d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
            </svg></button>
           </div>
         </div>
         </div>
        </div>`;
     // Update the DOM with post content
     document.getElementById("post").innerHTML = ``;
     document.getElementById("post").innerHTML += content;
 
     // Show loader while fetching post details
     loaderToggler(true);

// Add event listener to navigate to the author's profile page
let moveToProfilePage = document.querySelectorAll(`.moveToProfilePage`);
Array.from(moveToProfilePage).forEach(profilePage => profilePage.addEventListener('click', () => {
  // Get the user ID from the clicked element's data attribute
  const userId = profilePage.getAttribute('data-user-id');
  // Redirect to the author's profile page using the obtained user ID
  window.location = `profileAccount.html?postId=${userId}`;
}));

// Add event listener to navigate to the current user's profile page
let moveToMyProfile = document.querySelectorAll(`.moveToMyProfile`);
Array.from(moveToMyProfile).forEach(myProfilePage => myProfilePage.addEventListener('click', () => {
  // Get the current user using the provided module function
  const user = workModule.getCurrentUser();
  // Redirect to the current user's profile page using the obtained user ID
  window.location = `profileAccount.html?userId=${user.id}`;
}));

// Add event listener to handle adding a new comment
let addNewCommentBtn = document.getElementById("addNewCommentBtn");
addNewCommentBtn.addEventListener("click", async function fillComments() {
  try {
    // Get the comment body from the input field
    const commentBody = document.getElementById("commentInput").value;
    // Prepare parameters for the comment creation API call
    const params = {
      body: commentBody,
    };

    // Get the user's token from local storage
    const token = localStorage.getItem("token");
    // Build the URL for creating a new comment
    const url = `${baseUrl}posts/${postId}/comments`;

    // Make a POST request to add a new comment
    await axios.post(url, params, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    // Refresh the displayed post and show a success alert
    displayPost();
    showAlert("addNewComment", "New comment has been added successfully!");
  } catch (error) {
    // Handle errors and show a failure alert
    const message = error.response?.data?.message || "Error adding a new comment";
    showAlert("Failed", message);
  }
});


  } catch (error) {
    console.log(error);
    error.response?.data?.message || "Error adding a new comment";
    showAlert("Failed", message);
  } finally{
    // Hide loader after post details are displayed
    loaderToggler(false);
  }
}





loaderToggler;
changeUI;
getCurrentUser;
showAlert;
logOutSubmit;
loginSubmit;
registerSubmit;