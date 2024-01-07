// Import the necessary modules from the main.js file
import * as workModule from "./main.js";

// Change the UI using the imported module
workModule.changeUI();
const baseUrl = "https://tarmeezacademy.com/api/v1/";

// Initialize variables for pagination
let currentPage = 1;
let lastPage = 1;
const posts=document.getElementById("posts");




// Add a scroll event listener to the window
window.addEventListener("scroll", () => {
  // Check if the user has scrolled to the end of the page
  const endOfPage = window.innerHeight + window.scrollY >= document.body.scrollHeight;
  console.log( endOfPage  && currentPage < lastPage);
  if (endOfPage) {
    // Increment the current page and display the next set of posts
    currentPage = currentPage + 1;
    displayPosts(false, currentPage);
  }
});




workModule.changeUI();
displayPosts();
// Define the displayPosts function
export async function displayPosts(reload = true, page = 1) {
  try {
    // Toggle the loader on
    workModule.loaderToggler(true);

    // get posts from the API based on the current page
    const response = await axios.get(`${baseUrl}posts?limit=15&page=${page}`);
    const posts = await response.data.data;

    // Get the last page from the response metadata
    lastPage = response.data.meta.last_page;

    // Clear the posts container if reloading
    if (reload) {
      document.getElementById("posts").innerHTML = "";
    }

    // Loop through each post and create HTML content
    await posts.map((post) => {
      // Extract relevant information from the post
      const author = post.author;
      const postTitle = post.title || "";

      // Check if the post belongs to the current user
      let user = workModule.getCurrentUser();
      let isMyPost = user != null && post.author.id == user.id;
      let permissionChange = ``;
      if (isMyPost) {
        // Display options for the post owner
        permissionChange = `
          <div class="dropdown  border-0  ms-auto ">
            <!-- Dropdown button for post options -->
            <button class=" border-0 bg-transparent" type="button" aria-label="dropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1E6B6B" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
              </svg>
            </button>
            <!-- Dropdown menu with post edit and delete options -->
            <ul class="dropdown-menu py-0 ">
              <li data-post="${encodeURIComponent(JSON.stringify(post))}" class="editMyPost dropdown-item list-group-item-action d-flex gap-2 align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1E6B6B" class="bi bi-pencil-square" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>Edit
              </li>
              <li data-post="${encodeURIComponent(JSON.stringify(post))}" class="deletePostModal dropdown-item list-group-item-action d-flex gap-2 align-items-center text-bg-danger rounded-bottom" data-bs-toggle="modal" data-bs-target="#deletePostModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                </svg>Delete
              </li>
            </ul>
          </div>
        `;
      }

      // Function to check if a URL is valid
      function isValidURL(url) {
        try {
          new URL(url);
          return true;
        } catch (error) {
          return false;
        }
      }

      // HTML content for each post
      const content = `
        <div class="card shadow mb-4 ">
          <div class="card-header d-flex align-items-center">
            <div>
              <!-- Profile picture and username of the post author -->
              <span class="moveToProfilePage mx-1 font-weight-bolder" data-user-id="${author.id}"  >
                <a href="#" aria-label="user Profile Pic"><img id="userProfilePic" class="profilePic rounded-circle border border-2" alt="Profile pic" src="${
                  Object.entries(post.author.profile_image).length === 0
                    ? `./images/1.webp`
                    : `${post.author.profile_image}`
                }" > </a>
                <span class="userNameCapitalize">
                  ${author.username}
                </span>
              </span>
            </div>
            ${permissionChange}
          </div>
          <div  class=" card-body pt-3">
            <!-- Post image -->
            <img id="postImg" class="imgPost w-100 rounded mb-1" src="${
              isValidURL(post.image)
                ? post.image
                : "images/page-not-found.webp"
            }"   alt="postImg">
            <b class="text-secondary fw-light fs-6">${post.created_at}</b>
            <h5 class="card-title">${postTitle}</h5>
            <p class="card-text">${post.body}</p>
            <div class="card-footer p-0">
              <div class="commentsNumber redirectToPostDetails bg-white rounded  d-flex justify-content-center py-3" data-post-id="${post.id}">
                <!-- Comment icon and count -->
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
                  <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894m-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                </svg>
                <span class="mx-2">
                  (${post.comments_count}) Comments
                </span>
              </div>
            </div>
          </div>
        </div>`;

      // Append the post content to the "posts" container
      document.getElementById("posts").innerHTML += content;
    });

    // Add event listeners for post details and profile pages
    let redirectToPostDetails = document.querySelectorAll(`.redirectToPostDetails`);
    Array.from(redirectToPostDetails).forEach(redirectToPostDetail => redirectToPostDetail.addEventListener('click', () => {
      const postId = redirectToPostDetail.getAttribute('data-post-id');
      window.location = `postDetails.html?postId=${postId}`;
    }));

    let moveToProfilePage = document.querySelectorAll(`.moveToProfilePage`);
    Array.from(moveToProfilePage).forEach(profilePage => profilePage.addEventListener('click', () => {
      const userId = profilePage.getAttribute('data-user-id');
      console.log(userId);
      window.location = `profileAccount.html?userId=${userId}`;
    }));

    let moveToMyProfile = document.querySelectorAll(`.moveToMyProfile`);
    Array.from(moveToMyProfile).forEach(myProfilePage => myProfilePage.addEventListener('click', () => {
      const user = workModule.getCurrentUser();
      window.location = `profileAccount.html?userId=${user.id}`;
    }));

    // Add event listeners for post deletion
    let deleteMyPost = document.querySelectorAll(".deletePostModal");
    Array.from(deleteMyPost).forEach(deleteThisPost => {
      deleteThisPost.addEventListener("click", async function deleteMyPost() {
        try {
          let postAttribute = deleteThisPost.getAttribute('data-post');
          let post = JSON.parse(decodeURIComponent(postAttribute));
          document.getElementById("deletePostId").value = post.id;
          let deletePostModal = await bootstrap.Modal(document.getElementById("deletePostModal"), {});
          deletePostModal.toggle();
        } catch (error) {
          const message = error.response?.data?.message || "Error adding a new comment";
        }
      })
    });

    // Add event listener for post deletion confirmation
    const ConfirmPostDelete = document.getElementById("ConfirmPostDelete");
    ConfirmPostDelete.addEventListener("click", async function deleteConfirm() {
      try {
        const postId = document.getElementById("deletePostId").value;
        const url = (`${baseUrl}posts/${postId}`);
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "multipart/form-data",
          "authorization": `Bearer ${token}`,
        };

        // Send a DELETE request to delete the post
        const response = await axios.delete(url, {
          headers: headers,
        });
        const data = response.data;

        // Function to finalize post deletion
        function deleteFinal() {
          const modal = document.getElementById("deletePostModal")
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          displayPosts();
          workModule.showAlert("ThePostDeleted");
        }

        await deleteFinal();
      } catch (error) {
        const message = error.response?.data?.message || "Error adding a new comment";
        workModule.showAlert("Failed", message);
      }
    });


// Delete Post Confirmation   //





// EditPost
let editMyPostButtons = document.querySelectorAll(".editMyPost");
Array.from(editMyPostButtons).forEach(editThisPost => {
  editThisPost.addEventListener("click", async function editMyPost() {
    try {
      let postAttribute = editThisPost.getAttribute('data-post');
      let post = JSON.parse(decodeURIComponent(postAttribute));
      let postId = post.id;

      document.getElementById("postIdInput").value = postId;
      document.getElementById("PostModalTitle").innerHTML = "Edit Post";
      document.getElementById("addPostSubmit").innerHTML = "Update";
      document.getElementById("newPostBody").value = post.body;
      document.getElementById("newPostTitle").value = post.title;

      let postModal = await new bootstrap.Modal(document.getElementById("addPostModal"), {});
      postModal.toggle();
    } catch (error) {
      const message = error.response?.data?.message || "Error adding a new comment";
      showAlert("Failed", message);
    }
  });
});
// EditPost //




// Create Post  
let addNewPost = document.getElementById("addNewPost");
addNewPost.addEventListener("click", async function addNewPost() {
    document.getElementById("postIdInput").innerHTML = "Add New Post";
    document.getElementById("PostModalTitle").value = "";
    document.getElementById("addPostSubmit").innerHTML = "Add New Post";
    document.getElementById("newPostTitle").value = "";
    document.getElementById("newPostBody").value = "";
  });
// Create Post  //




workModule.loaderToggler(false);

} catch (error) {
    console.error("Error fetching posts:", error);
  } finally{
    workModule.loaderToggler(false);

  }
};



// add Post Submit
document.getElementById("addPostSubmit").addEventListener("click", async () => {
    try {
      // Get post details
      let postIdInput = document.getElementById("postIdInput").value;
      const isNewPost = postIdInput == null || postIdInput == "";
      const title = document.getElementById("newPostTitle").value;
      const body = document.getElementById("newPostBody").value;
      const image = document.getElementById("newPostImage").files[0];
      const token = localStorage.getItem("token");

      // Create form data with post details
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      formData.append("image", image);

      const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`,
      };
      let url = "";

      if (isNewPost) {
        url = `${baseUrl}posts`;
      } else {
        // Append "_method" parameter for update
        formData.append("_method", "put");
        url = `${baseUrl}posts/${postIdInput}`;
      }

      // Function to submit post creation/update
      async function submitCreateNewPost() {
        workModule.loaderToggler(true);
        const response = await axios.post(url, formData, {
          headers: headers,
        });

        // Hide the modal after a successful post creation
        const modal = document.getElementById("addPostModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        // Update the UI to reflect the new post
        workModule.changeUI();
        workModule.showAlert("addPostSubmit");
        displayPosts();
        
      workModule.loaderToggler(false);
      }

      await submitCreateNewPost();
    } catch (error) {
      // Show an alert for post creation failure
      const message = error.response?.data?.message || "Error creating a new post";
      workModule.showAlert("Failed", message);
    } finally {
      workModule.loaderToggler(false);
    }
  });




workModule.loaderToggler;
workModule.changeUI;
workModule.getCurrentUser;
workModule.showAlert;
workModule.logOutSubmit;
workModule.loginSubmit;
workModule.registerSubmit;
workModule.scrollToTop;
