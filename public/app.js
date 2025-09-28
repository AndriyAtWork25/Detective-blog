// public/app.js

// element refs
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const postContainer = document.getElementById("post-container");
const postForm = document.getElementById("post-form");
const postsList = document.getElementById("posts-list");
const authSection = document.getElementById("auth-section");

// error elements (register)
const regUsernameErrEl = document.getElementById("reg-username-error");
const regEmailErrEl = document.getElementById("reg-email-error");
const regPasswordErrEl = document.getElementById("reg-password-error");
const registerGeneralErrEl = document.getElementById("register-error");

// error elements (login)
const loginEmailErrEl = document.getElementById("login-email-error");
const loginPasswordErrEl = document.getElementById("login-password-error");
const loginGeneralErrEl = document.getElementById("login-error");

// error elements (post)
const postTitleErrEl = document.getElementById("post-title-error");
const postContentErrEl = document.getElementById("post-content-error");
const postCategoryErrEl = document.getElementById("post-category-error");
const postGeneralErrEl = document.getElementById("post-error");

let token = "";
let editingPostId = null;

// helper: clear error helpers
function clearRegisterErrors() {
  if (regUsernameErrEl) regUsernameErrEl.textContent = "";
  if (regEmailErrEl) regEmailErrEl.textContent = "";
  if (regPasswordErrEl) regPasswordErrEl.textContent = "";
  if (registerGeneralErrEl) registerGeneralErrEl.textContent = "";
}

function clearLoginErrors() {
  if (loginEmailErrEl) loginEmailErrEl.textContent = "";
  if (loginPasswordErrEl) loginPasswordErrEl.textContent = "";
  if (loginGeneralErrEl) loginGeneralErrEl.textContent = "";
}

function clearPostErrors() {
  if (postTitleErrEl) postTitleErrEl.textContent = "";
  if (postContentErrEl) postContentErrEl.textContent = "";
  if (postCategoryErrEl) postCategoryErrEl.textContent = "";
  if (postGeneralErrEl) postGeneralErrEl.textContent = "";
}

function renderFieldErrors(errorsObjOrArray, prefix = "", generalEl = null) {
  if (prefix.startsWith("reg")) clearRegisterErrors();
  if (prefix.startsWith("login")) clearLoginErrors();
  if (prefix.startsWith("post")) clearPostErrors();

  if (!errorsObjOrArray) return;

  let anyFieldErrorDisplayed = false;

  if (Array.isArray(errorsObjOrArray)) {
    errorsObjOrArray.forEach(err => {
      const id = `${prefix}${err.param}-error`;
      const el = document.getElementById(id);
      if (el) {
        el.textContent = err.msg;
        el.style.display = "block";
        anyFieldErrorDisplayed = true;
      }
    });
  } else if (typeof errorsObjOrArray === "object") {
    Object.keys(errorsObjOrArray).forEach(field => {
      const id = `${prefix}${field}-error`;
      const el = document.getElementById(id);
      if (el) {
        el.textContent = errorsObjOrArray[field];
        el.style.display = "block";
        anyFieldErrorDisplayed = true;
      } else {
        // якщо елемент не знайдено, показуємо як загальну помилку
        if (generalEl) {
          generalEl.textContent = errorsObjOrArray[field];
          generalEl.style.display = "block";
          anyFieldErrorDisplayed = true;
        }
      }
    });
  }

  if (generalEl && errorsObjOrArray.message && !anyFieldErrorDisplayed) {
    generalEl.textContent = errorsObjOrArray.message;
    generalEl.style.display = "block";
  }
}



// attach small helpers to clear field errors on user input (better UX)
["reg-username","reg-email","reg-password","login-email","login-password","post-title","post-content","post-category"].forEach(id => {
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener("input", () => {
      const errEl = document.getElementById(id + "-error");
      if (errEl) errEl.textContent = "";
      // also clear general error of the group
      if (id.startsWith("reg") && registerGeneralErrEl) registerGeneralErrEl.textContent = "";
      if (id.startsWith("login") && loginGeneralErrEl) loginGeneralErrEl.textContent = "";
      if (id.startsWith("post") && postGeneralErrEl) postGeneralErrEl.textContent = "";
    });
  }
});

// --------------------- REGISTER ---------------------
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearRegisterErrors();

    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }) // ← тут ще додаємо email
      });

      const data = await res.json();
      console.log("Register response:", res.status, data);


      if (res.ok) {
        // success: clear form and switch to login
        if (registerGeneralErrEl) registerGeneralErrEl.textContent = "";
        registerForm.reset();
        document.getElementById("register-box").classList.add("hidden");
        document.getElementById("login-box").classList.remove("hidden");
      } else {
        // handle validation errors (400) або general message
        if (res.status === 400 && data.errors) {
          renderFieldErrors(data.errors, "reg-", registerGeneralErrEl);
        } else {
          if (registerGeneralErrEl) {
            registerGeneralErrEl.textContent = data.message || "Registration failed";
            registerGeneralErrEl.style.display = "block";
          }
        }
      }
    } catch (err) {
      console.error(err);
      if (registerGeneralErrEl) {
        registerGeneralErrEl.textContent = "Error registering user";
        registerGeneralErrEl.style.display = "block";
      }
    }
  });
}

// --------------------- LOGIN ---------------------
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearLoginErrors();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // success
        token = data.token;
        // persist token locally (optional)
        try { localStorage.setItem("token", token); } catch (e) {}
        if (loginGeneralErrEl) loginGeneralErrEl.textContent = "";
        authSection.style.display = "none";
        postContainer.style.display = "block";
        loadPosts();
      } else {
        if (res.status === 400 && data.errors) {
          renderFieldErrors(data.errors, "login-");
        } else {
          if (loginGeneralErrEl) loginGeneralErrEl.textContent = data.message || "Login failed";
        }
      }
    } catch (err) {
      console.error(err);
      if (loginGeneralErrEl) loginGeneralErrEl.textContent = "Error logging in";
    }
  });
}

// --------------------- CREATE / UPDATE POST ---------------------
if (postForm) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearPostErrors();

    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content").value;
    const category = document.getElementById("post-category").value;

    try {
      let url = "/api/posts";
      let method = "POST";

      if (editingPostId) {
        url += `/${editingPostId}`;
        method = "PUT";
      }

      // use token from memory or localStorage if available
      if (!token) token = localStorage.getItem("token") || "";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, category })
      });

      const data = await res.json();

      if (res.ok) {
        if (postGeneralErrEl) postGeneralErrEl.textContent = "";
        postForm.reset();
        editingPostId = null;
        loadPosts();
      } else {
        if (res.status === 400 && data.errors) {
          renderFieldErrors(data.errors, "post-", postGeneralErrEl);
        } else {
          if (postGeneralErrEl) {
            postGeneralErrEl.textContent = data.message || "Error saving post";
            postGeneralErrEl.style.display = "block";
          }
        }
      }
    } catch (err) {
      console.error(err);
      if (postGeneralErrEl) {
        postGeneralErrEl.textContent = "Error saving post";
        postGeneralErrEl.style.display = "block";
      }
    }
  });
}

// --------------------- SWITCH BETWEEN FORMS ---------------------
const showLogin = document.getElementById("show-login");
const showRegister = document.getElementById("show-register");

if (showLogin) {
  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    // clear errors when switching
    clearRegisterErrors();
    clearLoginErrors();

    document.getElementById("register-box").classList.add("hidden");
    document.getElementById("login-box").classList.remove("hidden");
  });
}

if (showRegister) {
  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    clearRegisterErrors();
    clearLoginErrors();

    document.getElementById("login-box").classList.add("hidden");
    document.getElementById("register-box").classList.remove("hidden");
  });
}

// --------------------- LOAD ALL POSTS ---------------------
async function loadPosts() {
  postsList.innerHTML = "";
  try {
    if (!token) token = localStorage.getItem("token") || "";

    const res = await fetch("/api/posts", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const posts = await res.json();
    posts.forEach(post => {
      const div = document.createElement("div");
      div.className = "post-card";
      div.innerHTML = `
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.content)}</p>
        <p><strong>Category:</strong> ${escapeHtml(post.category || "")}</p>
        <p><i>Author: ${escapeHtml(post.author?.username || "Unknown")}</i></p>
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
    if (!token) token = localStorage.getItem("token") || "";
    const res = await fetch(`/api/posts/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const post = await res.json();
    if (res.ok) {
      document.getElementById("post-title").value = post.title;
      document.getElementById("post-content").value = post.content;
      document.getElementById("post-category").value = post.category || "";
      editingPostId = id;
      // scroll to form or focus (optional)
      document.getElementById("post-title").focus();
    } else {
      // show error near post form
      if (postGeneralErrEl) postGeneralErrEl.textContent = post.message || "Error fetching post";
    }
  } catch (err) {
    console.error(err);
    if (postGeneralErrEl) postGeneralErrEl.textContent = "Error fetching post";
  }
};

// --------------------- DELETE POST ---------------------
window.deletePost = async (id) => {
  if (!confirm("Are you sure you want to delete this post?")) return;
  try {
    if (!token) token = localStorage.getItem("token") || "";
    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      // reload posts
      loadPosts();
    } else {
      if (postGeneralErrEl) postGeneralErrEl.textContent = data.message || "Error deleting post";
    }
  } catch (err) {
    console.error(err);
    if (postGeneralErrEl) postGeneralErrEl.textContent = "Error deleting post";
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

// --------------------- Utilities ---------------------
// minimal HTML escape to avoid XSS in rendering
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}


