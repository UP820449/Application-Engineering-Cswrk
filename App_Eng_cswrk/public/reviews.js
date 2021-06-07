console.log("hello");
const toggleFeedbackModal = () => {
  const modal = document.querySelector(".modal-feedback");
  document.querySelector(".add-feedback").addEventListener("click", () => {
    modal.style.display = "flex";
  });
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
  //singleReview();

  //Handle error if any
  if (obj.error) return console.log(obj.error);
};

const getTaggedReviews = async (uURL) => {
  const response = await fetch(`/api/taggedReviews/${uURL}`);
  // Handle response
  const data = await response.json();
  return data;
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

const emptyInput = () => {
  const inputs = document.getElementsByClassName("uinput");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
};

toggleFeedbackModal();
addFeedback();
