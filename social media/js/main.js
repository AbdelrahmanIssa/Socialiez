document.addEventListener("DOMContentLoaded", function () {
const baseUrl = "https://tarmeezacademy.com/api/v1/";
let currentPage = 1
let lastPage = 1
const posts=document.getElementById("")


window.addEventListener("scroll", ()=>{
    
  const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight;
if (endOfPage) {
    currentPage = currentPage+1;
    displayPosts(false, currentPage);


}
});



displayPosts();


async function displayPosts(reload = true, page = 1) {
  try {
    const response = await axios.get(`${baseUrl}posts?limit=15&page=${page}`);
    const posts = await response.data.data;
    lastPage = response.data.meta.last_page;
    if (reload) {
      posts.innerHTML = "";
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

      const content = `
           <div class="card shadow my-4">
           <div  onclick="redirectToNewPage()"  id="userProfilePicParent" class=" card-header">
           <span class=" mx-1 font-weight-bolder">
           <a><img id="userProfilePic" class=" rounded-circle border border-2" alt="" src="
           ${
             Object.entries(post.author.profile_image).length === 0
               ? `./images/1.png`
               : `${post.author.profile_image}`
           }" > </a>
           <span>
                ${author.username}
             </span>
           </div>
           <div  class=" card-body pt-0">
            <img id="postImg" class="w-100 shadow-bottom mb-2" src="${
              isValidURL(post.image)
                ? post.image
                : "images/imageserror-page-not-found.jpg.jpg"
            }"   alt="">
             <b class="text-secondary fw-light">${post.created_at}</b>
             <h5 class="card-title">${postTitle}</h5>
             <p class="card-text">${post.body}</p>
             <div class="card-footer bg-white">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                 <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
            </svg>
             <span class="mx-2">
            (${post.comments_count}) Comments
             </span>
             </div>
           </div>
        </div>`;
      document.getElementById("posts").innerHTML += content;


  

    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};
function redirectToNewPage() {
  window.location.href = "postDetails.html";
}




function changeUI() {
  const token = localStorage.getItem("token");
  const notLoggedInDiv = document.getElementById("notLoggedInDiv");
  const loggedInDiv = document.getElementById("loggedInDiv");
  const addNewPost = document.getElementById("addNewPost");
  const navUsername = document.getElementById("navUsername");
  const myProfilePic = document.getElementById("myProfilePic");
  if (token == null) {//for not loggedIn users
    loggedInDiv.style.setProperty("display", "none", "important");
    notLoggedInDiv.style.setProperty("display", "flex", "important");
    addNewPost.style.setProperty("display", "none", "important");
  } 
  else {//for loggedIn users
    loggedInDiv.style.setProperty("display", "flex", "important");
    notLoggedInDiv.style.setProperty("display", "none", "important");
    addNewPost.style.setProperty("display", "flex", "important");
    const user =  getCurrentUser();
    navUsername.innerHTML=user.username
    myProfilePic.src = Object.entries(user.profile_image).length === 0 ? "./images/imageserror-page-not-found.jpg.jpg" : user.profile_image;

  }
};
changeUI();




function getCurrentUser()
{
    let user = null 
    const storageUser = localStorage.getItem("user")

    if(storageUser != null)
    {
        user = JSON.parse(storageUser)
        
    }
    
    return user
};






function showAlert( resourceOfMessage , message ) {

  const togglerAlert = document.getElementById("AlertToggler");
  togglerAlert.classList.replace("d-none", "d-flex");

  if (resourceOfMessage === "registration") {
    togglerAlert.classList.replace("alert-danger", "alert-info");
    togglerAlert.innerHTML = "Welcome on Socialize";
  } else if (resourceOfMessage === "loggedIn") {
    togglerAlert.classList.replace("alert-danger", "alert-info");
    togglerAlert.innerHTML = "Successful Login";
  }else if (resourceOfMessage === "loggedOut") {
    togglerAlert.classList.replace("alert-info", "alert-danger");
    togglerAlert.innerHTML = "Logged Out!";
  } else if (resourceOfMessage === "addPostSubmit") {
    togglerAlert.classList.replace("alert-danger", "alert-info");
    togglerAlert.innerHTML = "Your post been Added Successfully";
  }else if (resourceOfMessage === "Failed") {
    togglerAlert.classList.replace("alert-info", "alert-danger");
    togglerAlert.innerHTML = message;
  };;

  setTimeout(() => {
    togglerAlert.classList.replace("d-flex", "d-none");
  }, 4000);
};







loginSubmit.addEventListener("click", async () => {
  try {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const params = {
      username: username,
      password: password,
    };
    const url = `${baseUrl}login`;

    async function submitLogin() {
      const response = await axios.post(url, params);
      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));


      const modal = document.getElementById("loginModal")
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide()
      

      changeUI();
      showAlert("loggedIn");
    }

    await submitLogin();
  } catch (error) {
    const message = error.response.data.message;
    showAlert("Failed",message);
  }
});









registerSubmit.addEventListener("click", async () => {
  try {
    const name = document.getElementById("registerName").value;
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const image = document.getElementById("registerImage").files[0]; 
  

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("image", image);



    const url = `${baseUrl}register`;
    const headers = {
      "Content-Type": "multipart/form-data",
    };



    async function submitRegister() {
      const response = await axios.post(url, formData, {
        headers: headers,
      });
      const data = response.data;
      console.log(image)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const modal = document.getElementById("registerModal")
      const modalInstance = bootstrap.Modal.getInstance(modal)
     await modalInstance.hide()

      changeUI();
      showAlert("registration", "Successful registration");
    }

    await submitRegister();
  }
   catch (error) {
    const message = error.response.data.message;
    showAlert("Failed", message);
  }
});














logOutSubmit.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  changeUI();
  showAlert("loggedOut");
});








addPostSubmit.addEventListener("click", async () => {
  try {
    const title = document.getElementById("newPostTitle").value;
    const body = document.getElementById("newPostBody").value;
    const image = document.getElementById("newPostImage").files[0];
    const url = `${baseUrl}posts`;
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("image", image);

    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    async function submitCreateNewPost() {
      const response = await axios.post(url, formData, {
        headers: headers,
      });

      // Hide the modal after a successful post creation
      const modal = document.getElementById("addPostModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      // Update the UI to reflect the new post
      changeUI();
      displayPosts();
      showAlert( "addPostSubmit");
    }

    await submitCreateNewPost();

  } catch (error) {
    const message = error.response?.data?.message || "Error creating a new post";
    showAlert( "Failed",message);
  }
});
let toTopButton = document.getElementById("toTop");











window.addEventListener("scroll", function() {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    toTopButton.classList.add("show");
  } else {
    toTopButton.classList.remove("show");
  }
});




})