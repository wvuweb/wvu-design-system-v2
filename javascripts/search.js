import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/+esm';

// async function getPosts() {
//   try {
//     const res = await fetch("/search-data.json");
//     if (!res.ok) throw new Error(res.statusText);
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.log(error);
//     return error.message;
//   }
// }

const searchData = document.querySelector("#search-data").innerText;
const jsonResults = JSON.parse(searchData);

console.log('Json Results: ' + jsonResults);

function retrieveSearchResults(query) {
  const fuse = new Fuse(jsonResults, {
    keys: ["keywords"],
    includeScore: true,
    shouldSort: true,
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.3,
    distance: 500,
  });
  const searchResults = fuse.search(query);
  return searchResults;
}

function generatePostHTML(post) {
  return `
    <a class="btn btn-outline-dark d-block text-start rounded-0" href="${post.item.href}">${post.item.name}</a>
  `;
}

const form = document.querySelector("#search-form");
const searchResults = document.querySelector("#search-results");
form.addEventListener("input", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const query = formData.get("search");
  const postsToDisplay = await retrieveSearchResults(query);
  searchResults.innerHTML =
    postsToDisplay.length > 0
      ? "<div class='h6 mb-0 p-1 bg-dark text-white small w-100' role='status'>Showing " + postsToDisplay.length + " Results</div>" + postsToDisplay.map(generatePostHTML).join("")
      : "<div class='h6 mb-0 p-1 bg-dark text-white small w-100' role='status'>No Results Found</div>";
  const nodes = searchResults.querySelectorAll(".btn");
  const last = nodes[nodes.length-1];
  last.addEventListener("focusout", (event) => {
    searchResults.innerHTML = "";
  })
});

document.body.addEventListener("click", (event) => {
  searchResults.innerHTML = "";
})