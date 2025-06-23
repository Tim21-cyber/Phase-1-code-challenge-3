const BASE_URL = "http://localhost:3000/posts";

function main() {
  displayPosts();
  addNewPostListener();
}

function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";
      posts.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.textContent = post.title;
        postDiv.addEventListener("click", () => handlePostClick(post.id));
        postList.appendChild(postDiv);
      });
    });
}

function handlePostClick(id) {
  fetch(`${BASE_URL}/${id}`)
    .then(res => res.json())
    .then(post => {
      const detail = document.getElementById("detail-content");
      detail.innerHTML = `
        <h3>${post.title}</h3>
        <img src="${post.image}" alt="${post.title}">
        <p>${post.content}</p>
        <p><strong>Author:</strong> ${post.author}</p>
        <button onclick="deletePost(${post.id})">Delete</button>
      `;
    });
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const newPost = {
      title: formData.get("title"),
      author: formData.get("author"),
      image: formData.get("image"),
      content: formData.get("content")
    };

    fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(post => {
        displayPosts();
        form.reset();
      });
  });
}

function deletePost(id) {
  fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      displayPosts();
      document.getElementById("detail-content").innerHTML = "";
    });
}

document.addEventListener("DOMContentLoaded", main);
