//public/app.js
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const postContainer = document.getElementById("post-container");
const postForm = document.getElementById("post-form");
const postsList = document.getElementById("posts-list");
const authSection = document.getElementById("auth-section");


let token = "";
let editingPostId = null;

// --------------------- REGISTER ---------------------
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("reg-username").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    alert(data.message);
    document.getElementById("register-form").reset();
    document.getElementById("register-box").classList.add("hidden");
    document.getElementById("login-box").classList.remove("hidden");
  } catch (err) {
    console.error(err);
    alert("Error registering user");
  }
});

// --------------------- LOGIN ---------------------
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
     token = data.token;
     alert(data.message);
     authSection.style.display = "none";   // ховаємо register/login
     postContainer.style.display = "block"; // показуємо пости
     loadPosts();

    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Error logging in");
  }
});

// --------------------- CREATE / UPDATE POST ---------------------
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;

  try {
    let url = "http://localhost:5000/api/posts";
    let method = "POST";

    if (editingPostId) {
      url += `/${editingPostId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    });

    const data = await res.json();
    if (res.ok) {
      alert(editingPostId ? "Post updated!" : "Post created!");
      postForm.reset();
      editingPostId = null;
      loadPosts();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Error saving post");
  }
});

// --------------------- LOAD ALL POSTS ---------------------
async function loadPosts() {
  postsList.innerHTML = "";
  try {
    const res = await fetch("http://localhost:5000/api/posts", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const posts = await res.json();
    posts.forEach(post => {
  const div = document.createElement("div");
  div.className = "post-card"; // <--- оце додаємо
  div.innerHTML = `
    <h3>${post.title}</h3>
    <p>${post.content}</p>
    <p><i>Author: ${post.author.username}</i></p>
    <button class="edit-btn" onclick="editPost('${post._id}')">
      <i class="fa-solid fa-magnifying-glass"></i> Edit
    </button>
    <button class="delete-btn" onclick="deletePost('${post._id}')">
      <i class="fa-solid fa-trash"></i> Delete
    </button>
  `;
  postsList.appendChild(div);
});


  } catch (err) {
    console.error(err);
    postsList.innerHTML = "<p>Error loading posts</p>";
  }
}

// --------------------- EDIT POST ---------------------
window.editPost = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const post = await res.json();
    if (res.ok || res.status === 200) {
      document.getElementById("post-title").value = post.title;
      document.getElementById("post-content").value = post.content;
      editingPostId = id;
    } else {
      alert(post.message);
    }
  } catch (err) {
    console.error(err);
    alert("Error fetching post");
  }
};

// --------------------- DELETE POST ---------------------
window.deletePost = async (id) => {
  if (!confirm("Are you sure you want to delete this post?")) return;
  try {
    const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      loadPosts();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Error deleting post");
  }
};

// --------------------- SEARCH POSTS ---------------------
const searchBar = document.getElementById("search-bar");

if (searchBar) {
  searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase();
    const posts = document.querySelectorAll(".post-card");

    posts.forEach(post => {
      const title = post.querySelector("h3").innerText.toLowerCase();
      const content = post.querySelector("p").innerText.toLowerCase();

      if (title.includes(query) || content.includes(query)) {
        post.style.display = "block";
      } else {
        post.style.display = "none";
      }
    });
  });
}

