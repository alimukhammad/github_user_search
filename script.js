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
const userGetFunction = (name) => {  //declate variable, accepts one parameter, => is to define a function 
    axios(api + name).then((response) => { //axios is used to make HTTP requests to a web server, api + name is the URL, then is a promise that is resolved when the request is successful, response is the data returned by the server
        userCard(response.data); //userCard function is called with the data returned by the server
        repoGetFunction(name); //repoGetFunction is called with the name of the user
    }) 
    .catch((err) => { 
        if ( 
            err.response.status == 404) { 
            errorFunction( "No profile with this username");
        }
    });
} 

// repoGetFunction: api call to get the repositories of the user
const repoGetFunction = (name) => { 
	axios( api + name + "/repos?sort=created").then((response) => { //axios is used to make HTTP requests to a web server, api + name is the URL, then is a promise that is resolved when the request is successful, response is the data returned by the server
        repoCardFunction( response.data);
    }) 
    .catch((err) => { errorFunction( "Problem fetching repos");
    });
}

//userCard: to display all the user information
const userCard = (user) => { 
	let id = user.name || user.login; 
	let info = user.bio ? `<p>${user.bio}</p>`: ""; //if user.bio is true then info is assigned to user.bio else it is assigned to an empty string
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
            //create dom element with insert expression to develop the cardElement ${} is a placeholder for the value of the variable, create id='repos' to display the repositories of the user

	main.innerHTML = cardElement //assign cardElement to the innerHTML of the main element
} 

const errorFunction = (error) => { 
	let cardHTML = ` 
            <div class="card"> 
            <h1>${error}</h1> 
            </div>`;

	main.innerHTML = cardHTML
} 

//repoCardFunction: to display the repositories of the user
const repoCardFunction = (repos) => { 
	let reposElement = document.getElementById( "repos"); //assign element to reposElement variable

	for (let i = 0; i < 5 && i < repos.length; i++) { //for loop to display the first 5 repositories of the user
		let repo = repos[i];                        //assign the value of the current element of the array to the variable repo
		let repoEl = document.createElement("a"); //create a element in memory assign it to repoEl
		repoEl.classList.add("repo"); //add class repo to the repoEl element
		repoEl.href = repo.html_url; //assign the value of the html_url property of the repo object to the href attribute of the repoEl element
		repoEl.target = "_blank"; //assign the value of the string "_blank" to the target attribute of the repoEl element
		repoEl.innerText = repo.name; //assign the value of the name property of the repo object to the innerText attribute of the repoEl element because the innerText attribute is a string, it is displayed as text on the screen
		reposElement.appendChild(repoEl);} //add the repoEl element to the reposElement element because the appendChild() method adds a node to the end of the list of children of a specified parent node
    }

inputForm.addEventListener("submit", (e) => { //add an event listener to the inputForm element that listens for the submit event and executes the function when the event occurs
	e.preventDefault(); //prevent the default action of the event from occurring
	let user = inputBox.value; 
	if (user) { //if the user variable is not empty
		userGetFunction(user); //call the userGetFunction with the user variable as an argument
		inputBox.value = ""; //assign an empty string to the value attribute of the inputBox element
    }    
});
