// script.js 

let api = "https://api.github.com/users/"; // assign the api url to a variable

let fetch = document.createElement("script"); //create a element in memory assign it to fetch

fetch.src = `https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js`; // HTTP request to the server to fetch the data 

fetch.integrity = `ha512-DZqqY3PiOvTP9HkjIWgjO6ouCbq+dxqWoJZ/Q+zPYNHmlnI2dQnbJ5bxAHpAMw+LXRm4D72EIRXzvcHQtE8/VQ==`; 
// This line of JavaScript code is setting the integrity attribute of a script element (named fetch). The integrity attribute is used for security. It contains a hash value - a kind of digital fingerprint of the file.
// When the browser loads the script, it calculates its own hash of the file. If this calculated hash matches the one in the integrity attribute, the browser knows the file has not been tampered with and runs the script. If they don't match, the browser refuses to execute the script. This helps ensure the script hasn't been altered and is safe to use.

fetch.crossOrigin = "anonymous"; 

document.head.appendChild(fetch); //fetch element is added to the DOM element head of the document
//*document is a built-in object in the JavaScript DOM (Document Object Model) that represents the web page loaded in the browser. It is the entry point to the web page and all its content, allowing you to interact with the page's elements and content.

let main = document.getElementById("main"); // assign element to main variable
let inputForm = document.getElementById("userInput"); // assign element to inputForm variable
let inputBox = document.getElementById("search"); // assign element to inputBox variable

// userGetFunction: api call by taking username as input
const userGetFunction = (name) => { 
    axios(api + name).then((response) => { 
        userCard(response.data); 
        repoGetFunction(name);
    }) 
    .catch((err) => { 
        if ( 
            err.response.status == 404) { 
            errorFunction( "No profile with this username");
        }
    });
} 

const repoGetFunction = (name) => { 
	axios( api + name + "/repos?sort=created").then((response) => { 
        repoCardFunction( response.data);
    }) 
    .catch((err) => { errorFunction( "Problem fetching repos");
    });
}

//userCard: to display all the user information
const userCard = (user) => { 
	let id = user.name || user.login; 
	let info = user.bio ? `<p>${user.bio}</p>`: ""; 
	let cardElement = ` 
            <div class="card"> 
            <div> 
            <img src="${user.avatar_url}"
                alt="${user.name}"
                class="avatar"> 
            </div> 

            <div class="user-info"> 
            <h2>${id}</h2>${info}<ul> 
            <li>${user.followers} <strong>Followers</strong></li> 
            <li>${user.following} <strong>Following</strong></li> 
            <li>${user.public_repos} <strong>Repos</strong></li> 
            </ul> 
            <div id="repos"></div> 
            </div> 
            </div>`; 

	main.innerHTML = cardElement
} 

const errorFunction = (error) => { 
	let cardHTML = ` 
            <div class="card"> 
            <h1>${error}</h1> 
            </div>`;

	main.innerHTML = cardHTML
} 

const repoCardFunction = (repos) => { 
	let reposElement = document.getElementById( "repos");

	for (let i = 0; i < 5 && i < repos.length; i++) { 
		let repo = repos[i]; 
		let repoEl = document.createElement("a"); 
		repoEl.classList.add("repo"); 
		repoEl.href = repo.html_url; 
		repoEl.target = "_blank"; 
		repoEl.innerText = repo.name; 
		reposElement.appendChild(repoEl);}
    }

inputForm.addEventListener("submit", (e) => { 
	e.preventDefault(); 
	let user = inputBox.value; 
	if (user) { 
		userGetFunction(user); 
		inputBox.value = "";
    }    
});
