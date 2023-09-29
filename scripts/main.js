const DEMO_STORAGE_KEY = "phd_sup_mock_data";
const DEMO_DATA = [
  {
    name: "Example Gratiae",
    orcid: "1234-1234-1234-1234",
    volunteers: [
      {
        institution: "Super Univeristy",
      },
      {
        institution: "Example College",
      },
    ],
  },
  {
    name: "Asd Wasd, PhD",
    orcid: "5555-abcd-aaaa-0000",
    volunteers: [
      {
        institution: "Exo Univeristy",
      },
    ],
  },
];
const START_SEARCH_LENGTH = 3;
const DEBOUNCE_TIME = 500;
const RESULTS_QUERY_PARAM = "#search-results";

(function init() {
  resultsContainer = document.querySelector(RESULTS_QUERY_PARAM);
  resetDemo();
})();

function resetDemo() {
  if (!localStorage.getItem(DEMO_STORAGE_KEY)) {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(DEMO_DATA));
  }
}

function search(q) {
  if (q.length < START_SEARCH_LENGTH) {
    resultsContainer.innerHTML = ``;
    return;
  }

  const items = JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY)).map((item) =>
    JSON.stringify(item)
  );
  const results = items
    .filter((item) => item.toLowerCase().includes(q.toLowerCase()))
    .map((item) => JSON.parse(item));

  resultsContainer.innerHTML = updateResults(results, q);
}

function updateResults(results) {
  if (!results.length) {
    return `<div class="alert alert-light col mx-3">No results</div>`;
  }

  return results
    .map(
      (item) => `
      <div class="col-6 col-md-4">
        <div class="card">
          <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted orcid">ORCID: ${
                item.orcid
              }</h6>
              <p class="card-text">Institutions: ${item.volunteers
                .map((vol) => vol.institution)
                .join(", ")}<br/>${item.volunteers.length} volunteers</p>
              <button class="btn btn-primary">References</button>
          </div>
        </div>
      </div>`
    )
    .join("");
}

const debounce = (context, func, delay) => {
  let timeout;

  return (...arguments) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func.apply(context, arguments);
    }, delay);
  };
};

const queryVolunteers = debounce(
  this,
  (searchTerm) => search(searchTerm),
  DEBOUNCE_TIME
);
