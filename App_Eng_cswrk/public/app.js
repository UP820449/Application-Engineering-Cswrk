//Add a new user to the db
const submitUser = async () => {
  const email = document.querySelector(".usrSignupInput");
  const password = document.querySelector(".pwrdSignupInput");

  let url = "/api/users";
  url += "?email=" + encodeURIComponent(email.value);
  url += "&password=" + encodeURIComponent(password.value);

  const response = await fetch(url, { method: "post" });

  if (!response.ok) {
    console.error(
      "error submitting user",
      response.status,
      response.statusText
    );
  } else {
    //   userSubmitted();
    console.log("user sucessfully submitted!");
    displayHome();
  }
};

const openModal = () => {
  const tag = document
    .querySelector(".addLink")
    .addEventListener("click", () => {
      fetchAllReviews();
      modal();
    });
};

const modal = () => {
  const modal = document.querySelector(".modal");
  modal.style.display = "block";
  addWork();
};

const toggleFeedbackModal = () => {
  const modal = document.querySelector(".modal-feedback");
  document.querySelector(".add-feedback").addEventListener("click", () => {
    modal.style.display = "flex";
  });
};

const addWork = () => {
  document.querySelector(".addwork").addEventListener("click", () => {
    const modal = document.querySelector(".modal");
    modal.style.display = "none";
    document.querySelector(".list").innerHTML = "";
    saveReview();
    addReviewsToDOM();
    emptyInput();
  });
};

const getContent = () => {
  const username = document.querySelector(".username").value;
  const link = document.querySelector(".link").value;
  const course = document.querySelector(".link").value;
  return { username, course, link };
};

const emptyInput = () => {
  const inputs = document.getElementsByClassName("uinput");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
};

const fetchAllReviews = async () => {
  const response = await fetch("/api/reviews");
  // Handle response
  const data = await response.json();
  return data;
};

const addReviewsToDOM = async () => {
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
      <p>${reviews[i].course}</p>
    </div>
    <div class='content'>
      <h4 class="label">Link</h4>
      <span><a href="https:${reviews[i].link}" target="_blank">${reviews[i].link}</a></span>
    </div>
    <div>
    <input class='u-url' readonly value=localhost:8080/review/${reviews[i].id}></input>  
    </div>
  </li>`;
  }
};

const saveReview = async () => {
  const content = getContent();
  // If empty do nothing
  if (content.username === "") return;
  console.log(content, "content");

  const opts = {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      username: content.username,
      course: content.course,
      link: content.link,
    }),
  };
  // Handle request
  const response = await fetch("/api/reviews", opts);
  const obj = await response.json();
  singleReview();

  //Handle error if any
  if (obj.error) return console.log(obj.error);
};

const singleReview = () => {
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
};

const getTaggedReviews = async (uURL) => {
  const response = await fetch(`/api/taggedReviews/${uURL}`);
  // Handle response
  const data = await response.json();
  return data;
};

const reviewPage = async (data, uURL) => {
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
      <p>${data[0].course}</p>
    </div>
    <div class='content'>
      <h4 class="label">Link</h4>
      <span><a href="https:${data[0].link}" target="_blank">${
    data[0].link
  }</a></span>
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
};

const feedbackValues = () => {
  const username = document.querySelector(".username").value;
  const comment = document.querySelector(".comment").value;
  return { username, comment };
};

const addFeedback = () => {
  const card = document.querySelector(".card");
  const uURL = card.attributes[1].value;
  document.querySelector(".plus-feedback").addEventListener("click", () => {
    addFeedbackServer(feedbackValues(), uURL);
    reloadFeedback(uURL);
    const modal = document.querySelector(".modal-feedback");
    modal.style.display = "none";
    emptyInput();
  });
};

const reloadFeedback = async (uURL) => {
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
};

const addFeedbackServer = async (content, uURL) => {
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
};
//Hide login and sign up page
document.querySelector(".signUpPage").classList.add("hidden");
document.querySelector(".homePage").classList.add("hidden");

//Signup button
document.querySelector(".signUpBtn").addEventListener("click", submitUser);
//for testing
document.querySelector(".signInBtn").addEventListener("click", submitUser);

//displaySignUp
document.querySelector(".signupLnk").addEventListener("click", function () {
  document.querySelector(".loginPage").classList.add("hidden");
  document.querySelector(".signUpPage").classList.remove("hidden");
});

//displayLogin
document.querySelector(".loginLnk").addEventListener("click", function () {
  document.querySelector(".signUpPage").classList.add("hidden");
  document.querySelector(".loginPage").classList.remove("hidden");
});

// //logout
document.querySelector(".logOut").addEventListener("click", function () {
  document.querySelector(".homePage").classList.add("hidden");
  document.querySelector(".loginPage").classList.remove("hidden");
});

// Display home page
const displayHome = () => {
  document.querySelector(".signUpPage").classList.add("hidden");
  document.querySelector(".loginPage").classList.add("hidden");
  document.querySelector(".homePage").classList.remove("hidden");
};

//Login function
//Login
async function login() {
  const email = document.getElementById("usrSignupInput");
  const pass = document.getElementById("pwrdSignupInput");

  let url = "/api/login";
  url += "?email=" + encodeURIComponent(email.value);
  url += "&pass=" + encodeURIComponent(pass.value);

  //Check login against logins on server
  const response = await fetch(url);

  if (!response.ok) {
    console.log("error");
    throw response;
  } else if (document.getElementById("usrSignupInput").value == "") {
    console.log("Please enter email");
  } else if (document.getElementById("pwrdSignupInput").value == "") {
    setStatus("Please enter password");
  } else {
    displayHome();
  }
}

openModal();
addReviewsToDOM();
singleReview();
