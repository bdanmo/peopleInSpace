const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

function getJSON(url, name = "") {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    if (name) {
      xhr.open('GET', `${url}${name}`);
    } else {
      xhr.open('GET', url);
    }
    xhr.onload = () => {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        //console.log(data);
        resolve(data);
      } else if (url.includes('wikipedia') && xhr.status === 404) {
        reject({
          title: name,
          search: `https://www.google.com/search?q=${encodeURI(name)}`
        });
      } else {
        reject(new Error(xhr.status));
      }
    };
    xhr.onerror = () => reject(Error('A network error occurred.'))
    xhr.send();
  });
}

function getWikiProfiles(data) {
  const profiles = data.people.map(person => {
    const craft = person.craft;
    return getJSON(wikiUrl, person.name)
      .then(data => {
        return {
          ...data,
          craft
        }
      });
  });
  return Promise.allSettled(profiles);
}

function generateHTML(data) {
  console.log(data);

  function createSection() {
    const section = document.createElement('section');
    peopleList.appendChild(section);
    return section;
  }
  data.forEach(person => {
    if (person.status === 'fulfilled') {
      const section = createSection();
      person = person.value;
      section.innerHTML = `
        <img src=${person.thumbnail.source}>
        <span>${person.craft}</span>
        <h2>${person.title}</h2>
        <p>${person.description}</p>
        <p>${person.extract}</p>
      `;
    } else {
      const section = createSection();
      person = person.reason;
      section.innerHTML = `
        <h2>${person.title}</h2>
        <p>Couldn't retrieve profile for ${person.title} from Wikipedia.</p>
        <h3><a href=${person.search} target="_blank">Search Google for more information on ${person.title}</p></h3>
      `;
    }
  });

}

btn.addEventListener('click', (event) => {
  event.target.textContent = 'Loading...'
  getJSON(astrosUrl)
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