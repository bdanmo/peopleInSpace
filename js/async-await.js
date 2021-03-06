const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const easterEggs = [{
  craft: "Death Star",
  name: "Darth Vader"
}, {
  craft: "Sputnik 2",
  name: "Laika"
}, {
  craft: "Some Ship",
  name: "Some Guy"
}];
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

async function getJSON(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function getPeopleInSpace(url) {
  const peopleJSON = await getJSON(url);
  peopleJSON.people.push(...easterEggs);

  const profiles = peopleJSON.people.map(async (person) => {
    const craft = person.craft;
    const profileJSON = await getJSON(wikiUrl + person.name);

    if (profileJSON.pageid) {
      return {
        ...profileJSON,
        craft
      }
    } else {
      return {
        ...profileJSON,
        craft,
        name: person.name,
        search: `https://www.google.com/search?q=${encodeURI(person.name)}`,
      }
    }
  });

  return Promise.all(profiles);
}

function generateHTML(data) {

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
        <img src=${person.thumbnail ? person.thumbnail.source : `https://via.placeholder.com/150x300.png?text=${encodeURI(person.title)}`}>
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

btn.addEventListener('click', event => {
  event.target.textContent = 'Loading...'

  getPeopleInSpace(astrosUrl)
    .then(generateHTML)
    .catch(e => {
      peopleList.innerHTML = `<h3>Something went wrong!</h3>`
      console.error(e);
    })
    .finally(() => event.target.remove());
});