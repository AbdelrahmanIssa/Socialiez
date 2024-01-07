// Base URL for API requests
const baseUrl = "https://tarmeezacademy.com/api/v1/";




// Function to toggle the visibility of a loader spinner
export function loaderToggler(show = true) {
  if (show) {
    // Show the loader
    document.getElementById("spinnerLoader").style.visibility = "visible";
  } else {
    // Hide the loader
    document.getElementById("spinnerLoader").style.visibility = "hidden";
  }
};



// Function to change the UI based on user authentication status
export function changeUI() {
  const token = localStorage.getItem("token");
  const notLoggedInDiv = document.getElementById("notLoggedInDiv");
  const loggedInDiv = document.getElementById("loggedInDiv");
  const addNewPost = document.getElementById("addNewPost");
  const navUsername = document.getElementById("navUsername");
  const myProfilePic = document.getElementById("myProfilePic");
  const navBar = document.getElementById('navbarNav');
  const navBarToggler = document.getElementById('navBarToggler');

  if (token == null) {
    // For not logged-in users
    loggedInDiv.style.setProperty("display", "none", "important");
    notLoggedInDiv.style.setProperty("display", "flex", "important");
    if (addNewPost != null) {
      addNewPost.style.setProperty("display", "none", "important");
    }
    navBar.classList.remove("collapse", "navbar-collapse");
    navBarToggler.style.setProperty("display", "none", "important");
  } else {
    // For logged-in users
    loggedInDiv.style.setProperty("display", "flex", "important");
    notLoggedInDiv.style.setProperty("display", "none", "important");
    if (addNewPost != null) {
      addNewPost.style.setProperty("display", "flex", "important");
    }
    const user = getCurrentUser();
    navUsername.innerHTML = user.username;
    myProfilePic.src = Object.entries(user.profile_image).length === 0 ? "./images/page-not-found.webp" : user.profile_image;
    navBar.classList.add("collapse", "navbar-collapse");
    navBarToggler.style.setProperty("display", "flex", "important");
  }
};




// Function to get the current user from local storage
export function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");

  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }

  return user;
};




// Function to show an alert message
export const showAlert = function showAlert(resourceOfMessage, message) {
  const togglerAlert = document.getElementById("alertToggler");
  togglerAlert.classList.replace("d-none", "d-flex");

  // Customize the alert message based on the resource
  if (resourceOfMessage === "registration") {
    togglerAlert.classList.replace("alert-danger", "alert-info");
    togglerAlert.innerHTML = "Welcome on Socialize";
  } else if (resourceOfMessage === "loggedIn") {
    togglerAlert.classList.replace("alert-danger", "alert-info");
    togglerAlert.innerHTML = "Successful Login";
  } else if (resourceOfMessage === "loggedOut") {
    togglerAlert.classList.replace("alert-info", "alert-danger");
    togglerAlert.innerHTML = "Logged Out!";
  } else if (resourceOfMessage === "addPostSubmit") {
    togglerAlert.classList.replace("alert-danger", "alert-info");
    togglerAlert.innerHTML = "Your Post has been Added Successfully";
  } else if (resourceOfMessage === "ThePostDeleted") {
    togglerAlert.classList.replace("alert-danger", "alert-info");
    togglerAlert.innerHTML = "Your Comment has been Added Successfully!";
  } else if (resourceOfMessage === "ThePostDeleted") {
    togglerAlert.classList.replace("alert-danger", "alert-info");
    togglerAlert.innerHTML = "The Post has been Deleted Successfully!";
  } else if (resourceOfMessage === "Failed") {
    togglerAlert.classList.replace("alert-info", "alert-danger");
    togglerAlert.innerHTML = message;
  }

  // Hide the alert after 4 seconds
  setTimeout(() => {
    togglerAlert.classList.replace("d-flex", "d-none");
  }, 4000);
};




// Event listener for the login submit button
export const loginSubmit = document.getElementById("loginSubmit").addEventListener("click", async () => {
  try {
    // Get username and password from input fields
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const params = {
      username: username,
      password: password,
    };
    const url = `${baseUrl}login`;

    // Function to submit login request
    async function submitLogin() {
      const response = await axios.post(url, params);
      loaderToggler(true);
      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Hide the login modal
      const modal = document.getElementById("loginModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      // Update the UI
      changeUI();
      showAlert("loggedIn");
      loaderToggler(false);
    }

    await submitLogin();
  } catch (error) {
    // Show an alert for login failure
    const message = error.response.data.message;
    showAlert("Failed", message);
  } finally {
    loaderToggler(false);
  }
});





// Event listener for the register submit button
export const registerSubmit = document.getElementById("registerSubmit").addEventListener("click", async () => {
  try {
    // Get user registration details
    const name = document.getElementById("registerName").value;
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const image = document.getElementById("registerImage").files[0];

    // Create form data with user details
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("image", image);

    const url = `${baseUrl}register`;
    const headers = {
      "Content-Type": "multipart/form-data",
    };

    // Function to submit user registration
    async function submitRegister() {
      loaderToggler(true);

      const response = await axios.post(url, formData, {
        headers: headers
      });
      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));


      // Hide the register modal
      const modal = document.getElementById("registerModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      await modalInstance.hide();

      // Update the UI
      changeUI();
      showAlert("registration", "Successful registration");
      loaderToggler(false);
    }

    await submitRegister();
  } catch (error) {
    // Show an alert for registration failure
    const message = error.response.data.message;
    showAlert("Failed", message);
  } finally {
    loaderToggler(false);
  }
});





// Event listener for the logout button
export const logOutSubmit = document.getElementById("logOutSubmit").addEventListener("click", () => {
  loaderToggler(true);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Update the UI after logout
  changeUI();
  showAlert("loggedOut");
  loaderToggler(false);
});





// Event listener to scroll to top when scrolling down
export const scrollToTop = window.addEventListener("scroll", function () {
  let toTopButton = document.getElementById("toTop");
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    toTopButton.classList.add("show");
  } else {
    toTopButton.classList.remove("show");
  }
});
