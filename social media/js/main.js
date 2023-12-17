// import {displayPosts} from "./homeLogic.js";
const baseUrl = "https://tarmeezacademy.com/api/v1/";


export let addPostSubmit = async() =>{ document.getElementById("addPostSubmit").addEventListener("click", async () => {
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
        headers: headers
      });
      // Hide the modal after a successful post creation
      const modal = document.getElementById("addPostModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      // Update the UI to reflect the new post
      changeUI();
      showAlert( "addPostSubmit");

      displayPosts();
    }

    await submitCreateNewPost();

  } catch (error) {
    const message = error.response?.data?.message || "Error creating a new post";
    showAlert( "Failed",message);
  }
})};







export function changeUI() {
    const token = localStorage.getItem("token");
    const notLoggedInDiv = document.getElementById("notLoggedInDiv");
    const loggedInDiv = document.getElementById("loggedInDiv");
    const addNewPost = document.getElementById("addNewPost");
    const navUsername = document.getElementById("navUsername");
    const myProfilePic = document.getElementById("myProfilePic");
    const navBar = document.getElementById('navbarNav');
    const navBarToggler = document.getElementById('navBarToggler');

    if (token == null) {//for not loggedIn users
      loggedInDiv.style.setProperty("display", "none", "important");
      notLoggedInDiv.style.setProperty("display", "flex", "important");
      if(addNewPost != null)
      {
        addNewPost.style.setProperty("display", "none", "important")
      };
      navBar.classList.remove("collapse", "navbar-collapse");
      navBarToggler.style.setProperty("display", "none", "important");
      
    } 
    else {//for loggedIn users
      loggedInDiv.style.setProperty("display", "flex", "important");
      notLoggedInDiv.style.setProperty("display", "none", "important");
      if(addNewPost != null)
      {
        addNewPost.style.setProperty("display", "flex", "important")
      };
      const user =  getCurrentUser();
      navUsername.innerHTML=user.username
      myProfilePic.src = Object.entries(user.profile_image).length === 0 ? "./images/imageserror-page-not-found.jpg.jpg" : user.profile_image;
      navBar.classList.add("collapse", "navbar-collapse");
      navBarToggler.style.setProperty("display", "flex", "important");
    }
  };
  


  
export function getCurrentUser()
{
    let user = null 
    const storageUser = localStorage.getItem("user")

    if(storageUser != null)
    {
        user = JSON.parse(storageUser)
        
    }
    
    return user
};




export  const showAlert=function showAlert( resourceOfMessage , message ) {

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
    togglerAlert.innerHTML = "Your Post been Added Successfully";
  }else if (resourceOfMessage === "addNewComment") {
    togglerAlert.classList.replace("alert-danger", "alert-info");
    togglerAlert.innerHTML = "Your Comment been Added Successfully!";
  }else if (resourceOfMessage === "Failed") {
    togglerAlert.classList.replace("alert-info", "alert-danger");
    togglerAlert.innerHTML = message;
  } ;
  setTimeout(() => {
    togglerAlert.classList.replace("d-flex", "d-none");
  }, 4000);
};





export const loginSubmit=document.getElementById("loginSubmit").addEventListener("click", async () => {
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





export const registerSubmit=document.getElementById("registerSubmit").addEventListener("click", async () => {
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




export const logOutSubmit=document.getElementById("logOutSubmit").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  changeUI();
  showAlert("loggedOut");
});










export const scrollToTop = window.addEventListener("scroll", function() {
  let toTopButton = document.getElementById("toTop");
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    toTopButton.classList.add("show");
  } else {
    toTopButton.classList.remove("show");
  }
});




