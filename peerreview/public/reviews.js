async function loadReviews() {
  const response = await fetch("/api/taggedReviews/vcb");
  const data = await response.json();
  return data
}

async function onDom() {
    const data = await loadReviews()
    console.log(data)
    document.querySelector('article').innerHTML = data[0].comment
}

onDom()
