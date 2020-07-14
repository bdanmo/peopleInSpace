const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

function getWikiProfiles(data) {
  const profiles = data.people.map(person => {
    const craft = person.craft;
    return fetch(wikiUrl + person.name)
      .then(response => response.json())
      .then(data => {
        if (data.pageid) {
          return {
            ...data,
            craft
          }
        } else {
          return {
            ...data,
            craft,
            name: person.name,
            search: `https://www.google.com/search?q=${encodeURI(person.name)}`,
          }
        }
      })
      .catch(err => console.log(`Error Fetching Wiki for ${person.name}:`, err));
  });
  return Promise.all(profiles);
}

function generateHTML(data) {
  console.log(data);

  function createSection() {
    const section = document.createElement('section');
    peopleList.appendChild(section);
    return section;
  }
  data.forEach(person => {
    //person = person.value;
    if (person.pageid) {
      const section = createSection();
      section.innerHTML = `
        <img src=${person.thumbnail.source}>
        <span>${person.craft}</span>
        <h2>${person.title}</h2>
        <p>${person.description}</p>
        <p>${person.extract}</p>
      `;
    } else {
      const section = createSection();
      section.innerHTML = `
        <span>${person.craft}</span>
        <h2>${person.name}</h2>
        <p><a href=${person.search} target="_blank">\Click to search Google for more information on this astronaut!</a></p>
        <p>Couldn't retrieve profile for ${person.name} from Wikipedia.</p>
      `;
    }
  });

}

btn.addEventListener('click', (event) => {
  event.target.textContent = 'Loading...'

  fetch(astrosUrl)
    .then(response => response.json())
    .then(getWikiProfiles)
    .then(generateHTML)
    .catch(err => {
      let html = `
        <h3>Something went wrong.</h3>
      `;
      peopleList.insertAdjacentHTML('afterbegin', html);
      console.log(err);
      throw err;
    })
    .finally(() => event.target.remove());
});