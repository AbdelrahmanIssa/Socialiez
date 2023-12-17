import * as workModule from "./main.js";

const baseUrl = "https://tarmeezacademy.com/api/v1/";
let currentPage = 1;
let lastPage = 1;
const posts=document.getElementById("posts");


window.addEventListener("scroll", ()=>{
    
  const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight;
if (endOfPage) {
    currentPage = currentPage+1;
    displayPosts(false, currentPage);


}
});


workModule.changeUI();
displayPosts();
export  async function displayPosts(reload = true, page = 1) {
  try {
    const response = await axios.get(`${baseUrl}posts?limit=15&page=${page}`);
    const posts = await response.data.data;
    lastPage = response.data.meta.last_page;
    if (reload) {
      document.getElementById("posts").innerHTML = "";
    };
    // map or for (const post of posts)
    await posts.map((post) => {
      const author = post.author;
      const postTitle = post.title || "";
      //or
      // let postTitle ="";
      // if (post.title != null) {
      // postTitle = post.title;
      // }
      //or
      //              ${Object.entries(post.title).length === 0
      // ? ``
      // : `${post.title}`}
      //
      function isValidURL(url) {
        try {
          new URL(url);
          return true;
        } catch (error) {
          return false;
        }
      };

      const content = 
      `
           <div class="card shadow mb-4 ">
           <div class="card-header">
           <span  class="mx-1 font-weight-bolder redirectToPostDetails " data-post-id="${post.id}" >
           <a><img id="userProfilePic" class=" rounded-circle border border-2" alt="" src="
           ${
             Object.entries(post.author.profile_image).length === 0
               ? `./images/1.png`
               : `${post.author.profile_image}`
           }" > </a>
          <span>
                ${author.username}
          </span>
            </span>
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
             <div class="card-footer p-0">
             <div class="commentsNumber bg-white rounded  d-flex justify-content-center py-3 ">
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
      document.getElementById("posts").innerHTML += content;
    });

    
    let redirectToPostDetails = document.querySelectorAll(`.redirectToPostDetails`);
    Array.from(redirectToPostDetails).forEach(redirectToPostDetail => redirectToPostDetail.addEventListener('click', () => {
    const postId = redirectToPostDetail.getAttribute('data-post-id');
    window.location = `postDetails.html?postId=${postId}`;


}));
    

} catch (error) {
    console.error("Error fetching posts:", error);
  }
};



export const addPostModal= document.getElementById("addPostModal")

workModule.changeUI;
workModule.getCurrentUser;
workModule.showAlert;
workModule.logOutSubmit;
workModule.loginSubmit;
workModule.registerSubmit;
workModule.scrollToTop;
workModule.addPostSubmit();
