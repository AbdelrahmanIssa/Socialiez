import {
  changeUI,
  getCurrentUser,
  showAlert,
  logOutSubmit,
  loginSubmit,
  registerSubmit,
  scrollToTop,
  addPostSubmit,
} from "./main.js";

const baseUrl = "https://tarmeezacademy.com/api/v1/";
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");

changeUI();
displayPost();

async function displayPost() {
  try {
    const response = await axios.get(`${baseUrl}posts/${postId}`);
    const post = await response.data.data;
    const comments = await post.comments;
    const author = await post.author;
    document.getElementById("userNameSpan").innerHTML = author.username;
    let commentContent = ``;
    for (const comment of comments) {
      commentContent += `
      <div class="card-footer pt-2 border-bottom">
        <div class="d-flex justify-content-between" >
        <div>
          <img id="commentImg"src="${
            isValidURL(comment.author.profile_image)
              ? post.image
              : "images/imageserror-page-not-found.jpg.jpg"
          }" class="rounded-circle" >
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
    const postTitle = post.title || "";

    function isValidURL(url) {
      try {
        new URL(url);
        return true;
      } catch (error) {
        return false;
      }
    }

    const content = `
           <div class="card shadow mb-4 ">
           <div class="card-header d-flex align-items-center">
           <div class="mx-1 font-weight-bolder">
           <a><img id="userProfilePic" class=" rounded-circle border border-2" alt="userProfilePic" src="
           ${
             Object.entries(post.author.profile_image).length === 0
               ? `./images/1.png`
               : `${post.author.profile_image}`
           }" > </a>
           <span>
                ${author.username}
             </span>
             </div>
             <div class="dropdown  border-0  ms-auto">
             <button class=" border-0 bg-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false"">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1E6B6B" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
             <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
             </svg>
             </button>
            <ul class="dropdown-menu py-0">
              <li id='editMyPost' class="dropdown-item  list-group-item-action d-flex gap-2 align-items-center ">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1E6B6B" class="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
            </svg>Edit</li>
              <li id="deleteMyPost"class="dropdown-item list-group-item-action d-flex gap-2 align-items-center text-bg-danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-trash3-fill" viewBox="0 0 16 16">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
              </svg>
              Delete</li>
            </ul>
            </div>
            <div>
          </div>
           </div>
           <div  class=" card-body pt-3">
            <img id="postImg" class="w-100 rounded mb-1" src="${
              isValidURL(post.image)
                ? post.image
                : "images/imageserror-page-not-found.jpg.jpg"
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
             <button id="addNewCommentBtn" class="btn bg-transparent p-0 m-0" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#1E6B6B"
             class="bi bi-plus-circle-fill text-primary " viewBox="0 0 16 16">
             <path
               d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
            </svg></button>
           </div>
         </div>
         </div>
        </div>`;
    document.getElementById("post").innerHTML = ``;
    document.getElementById("post").innerHTML += content;

    let addNewCommentBtn = document.getElementById("addNewCommentBtn");
    addNewCommentBtn.addEventListener("click", async function fillComments() {
      try {
        const commentBody = document.getElementById("commentInput").value;
        const params = {
          body: commentBody,
        };

        const token = localStorage.getItem("token");
        const url = `${baseUrl}posts/${postId}/comments`;

        await axios.post(url, params, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        displayPost();
        showAlert("addNewComment", "New comment been Added successfully!");
      } catch (error) {
        const message =
          error.response?.data?.message || "Error adding a new comment";
        showAlert("Failed", message);
      }
    });
    // let editMyPost = document.getElementById("editMyPost");
    // editMyPost.addEventListener("click", async function editMyPost() {
    //   try {
    //     console.log("yes");
    //     let postModal = new bootstrap.Modal(addPostModal)
    //   } catch (error) {
    //     const message =
    //       error.response?.data?.message || "Error adding a new comment";
    //     showAlert("Failed", message);
    //   }
    // });
  } catch (error) {
    const message = error.response.data.message;
    showAlert("Failed", message);
  }
}
changeUI();
getCurrentUser;
showAlert;
logOutSubmit;
loginSubmit;
registerSubmit;
scrollToTop;
addPostSubmit;

// logOutSubmit.logOutSubmit()?addNewComment.style("display: none"):addNewComment.style("display: block")
