const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

async function getPeopleInSpace(url) {
  const peopleResponse = await fetch(url);
  const peopleJSON = await peopleListRes.json();
  console.log(peopleJSON);
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

});