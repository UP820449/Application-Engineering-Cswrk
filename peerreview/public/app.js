function openModal() {
  const tag = document
    .querySelector(".addLink")
    .addEventListener("click", () => {
      fetchAllReviews();
      modal();
    });
}

function modal() {
  const modal = document.querySelector(".modal");
  modal.style.display = "block";
  addWork();
}

function toggleFeedbackModal() {
  const modal = document.querySelector(".modal-feedback");
  document.querySelector(".add-feedback").addEventListener("click", () => {
    modal.style.display = "flex";
  });
}

function addWork() {
  const list = document.querySelector(".list");

  const tag = document
    .querySelector(".addwork")
    .addEventListener("click", () => {
      const modal = document.querySelector(".modal");
      modal.style.display = "none";
      document.querySelector(".list").innerHTML = "";
      saveReview();
      addReviewsToDOM();
      emptyInput();
      // list.innerHTML += `<li class='card'><p>${getContent().username} ${
      //   getContent().link
      // }</p></li>`;
    });
}

function getContent() {
  const username = document.querySelector(".username").value;
  const link = document.querySelector(".link").value;
  return { username, link };
}

function emptyInput() {
  const inputs = document.getElementsByClassName("uinput");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
}

async function fetchAllReviews() {
  const response = await fetch("/api/reviews");
  // Handle response
  const data = await response.json();
  return data;
}

async function addReviewsToDOM() {
  const reviews = await fetchAllReviews();
  const list = document.querySelector(".list");
  list.innerHTML = "";
  for (let i = 0; i < reviews.length; i++) {
    list.innerHTML += `
    <li class="card firstcard" data-url=${reviews[i].id}>
    <div class='content'>
      <h4 class="label">Author</h4>
      <span>${reviews[i].username}</span>
    </div>
    <div class='content'>
      <h4 class="label">Assignment</h4>
      <p>Application Programming</p>
    </div>
    <div class='content'>
      <h4 class="label">Link</h4>
      <span><a href="#">${reviews[i].link}</a></span>
    </div>
  </li>`;
  }
}

async function saveReview() {
  const content = getContent();
  // If empty do nothing
  if (content.username === "") return;

  const opts = {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      name: content.username,
      link: content.link,
    }),
  };
  // Handle request
  const response = await fetch("/api/reviews", opts);
  const obj = await response.json();
  singleReview();

  //Handle error if any
  if (obj.error) return console.log(obj.error);
}

function singleReview() {
  const card = document.querySelector(".list");
  if (card) {
    card.addEventListener("click", async (e) => {
      if (e.target && e.target.tagName === "LI") {
        const id = e.target.attributes[1].value;
        const response = await fetch(`/api/reviews/${id}`);
        // Handle response
        const data = await response.json();
        reviewPage(data, id);
      }
    });
  }
}

async function getTaggedReviews(uURL) {
  const response = await fetch(`/api/taggedReviews/${uURL}`);
  // Handle response
  const data = await response.json();
  return data;
}

async function reviewPage(data, uURL) {
  const body = document.querySelector("body");
  const result = await getTaggedReviews(uURL);
  body.innerHTML = `
  <div>
  <button class="add-feedback btn">+</button>
  </div>
  <div class="modal-feedback">    
      <button class="btn plus-feedback">Done</button>
      <input class="uinput username" placeholder="Username" />
      <textarea class="uinput comment" placeholder="Your feedback..." rows="5" cols="33"></textarea>
    </div>
  <div class="card review-details" data-url=${data[0].id}>
  <div class='content'>
      <h4 class="label">Author</h4>
      <span>${data[0].username}</span>
    </div>
    <div class='content'>
      <h4 class="label">Assignment</h4>
      <p>Application Programming</p>
    </div>
    <div class='content'>
      <h4 class="label">Link</h4>
      <span><a href="#">${data[0].link}</a></span>
    </div>
    </div>
    <div>
    <h4 style="padding-left: 40px">Feedback</h4>
  <ul class="feedback-list">${result.map(
    (i) => `
    <li class='feedback-card '>
    <div class='feedback-card-content'>
    <h4 class="label">Author</h4>
    <span>${i.username}</span>
  </div>
  <div class='feedback-card-content'>
    <h4 class="label">Feedback</h4>
    <span>${i.comment}</span>
  </div></li>`
  )}</ul></div>`;
  addFeedback();
  toggleFeedbackModal();
}

function feedbackValues() {
  const username = document.querySelector(".username").value;
  const comment = document.querySelector(".comment").value;
  return { username, comment };
}

function addFeedback() {
  const card = document.querySelector(".card");
  const uURL = card.attributes[1].value;
  document.querySelector(".plus-feedback").addEventListener("click", () => {
    addFeedbackServer(feedbackValues(), uURL);
    reloadFeedback(uURL);
    const modal = document.querySelector(".modal-feedback");
    modal.style.display = "none";
    emptyInput();
  });
}

async function reloadFeedback(uURL) {
  const feedbackList = document.querySelector(".feedback-list");
  const result = await getTaggedReviews(uURL);
  feedbackList.innerHTML = `
  ${result.map(
    (i) => `
    <li class='feedback-card '>
    <div class='feedback-card-content'>
    <h4 class="label">Author</h4>
    <span>${i.username}</span>
  </div>
  <div class='feedback-card-content'>
    <h4 class="label">Feedback</h4>
    <span>${i.comment}</span>
  </div></li>`
  )}</ul></div>`;
}

async function addFeedbackServer(content, uURL) {
  if (content.username === "") return;
  const opts = {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      id: uURL,
      username: content.username,
      comment: content.comment,
    }),
  };
  // Handle request
  const response = await fetch("/api/taggedReviews", opts);
  const obj = await response.json();
  singleReview();

  //Handle error if any
  if (obj.error) return console.log(obj.error);
}
openModal();
addReviewsToDOM();
singleReview();
