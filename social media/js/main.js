const baseUrl = "https://tarmeezacademy.com/api/v1/"
async function getUser() {
  try {
    const response = await axios.get(`${baseUrl}posts?limit=3`);
    const posts = await response.data.data;

    // map or for (const post of posts)
    await posts.map((post) => {
      const author = post.author;
  
      const postTitle = post.title || "";
      //or
      // let postTitle ="";
      // if (post.title != null) {
      // postTitle = post.title;
      // }

      const content = `
           <div class="card shadow my-4">
           <div class="card-header">
             <img id="UserImage" class="rounded-circle border border-2" src="${author.profile_image}" alt="">
             <span id="nav-username" class="mx-1 font-weight-bolder">
                ${author.username}
             </span>
           </div>
           <div class="card-body">
            <img id="" class="w-100" src="${post.image}" alt="">
             <b class=" ms-3 text-secondary ">${post.created_at}</b>
             <h5 class="card-title">${postTitle}</h5>
             <p class="card-text">${post.body}</p>
             <div class="card-footer bg-white">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                 <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
            </svg>
             <span class="mx-2">
                 (${post.comments_count}) Comment
             </span>
             </div>
           </div>
        </div>`;
      document.getElementById("posts").innerHTML += content;
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}
getUser();

loginSubmit.addEventListener("click", ()=> {
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const params = {
    "username": username,
    "password": password
  }
  const url =`${baseUrl}login`
  async function submitLogin() {
    const response = await axios.post(url,params);
    const data = await response.data;
    console.log(data);

}
submitLogin();
  console.log(username,password);
})