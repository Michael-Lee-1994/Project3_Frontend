(() => {
    //Base Url routes needed for fetch requests
    const userURL = "http://localhost:3000/users"
    const itemURL = "http://localhost:3000/watch_items"
    const joinURL = "http://localhost:3000/user_watch_items"
    const API_KEY = ""
    const mainDiv = document.getElementById("main")

    //Creating one event listener that listens to the main Div
    const createMainDivEventListener = () => {
        mainDiv.addEventListener("click", (e) => {
            eventHandler(e)
        })
    }

    //Function used to create a brand new user, if the user clicks the sign up button
    const signUpUser = (username, first_name, last_name) => {
        //Split up the fetch options into separate variable, since I'm using the same varible names, that fit the database names for the variables, can make my data a one liner
        let data = { username, first_name, last_name}

        let options = {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify(data)
        }
        //My Post fetch request, that runs renders the home page after user creation without refreshing the Dom
        fetch(userURL, options)
        .then(res => res.json())
        .then(json => renderHome(json))
        
    }

    //Login function

    const loginUser = (username) => {
        let input = username
        let data = {username: username}

        let options = {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify(data)
        }
        //My Post fetch request, that runs renders the home page after user creation without refreshing the Dom
        fetch("http://localhost:3000/login", options)
        .then(res => res.json())
        .then(data => userValidation(data, input))
      
    }

    //User validation function, that checks if user is in the database
    const userValidation = (json, input) => {
        if (json == null) {
            window.alert("User does not exist")
        } else if (json.username == input ) {
            console.log("User valid")
            renderHome(json)
        } else {
            console.log( "This shouldn't hit")
        }
    }

    // Clears the main Div so that we can render a home page fresh, without any page reloads, renders welcome page
    const renderHome = (json, input) => {
        console.log(json)
        mainDiv.innerHTML = ""
        renderWelcome(json)
        renderSearch()
        renderItems(json)
    }

    //Renders the Welcome, prompt when entering home page
    const renderWelcome = (json) => {
        let body = document.querySelector("body")
        let h1 = document.createElement("h1")
        h1.id = json.id
        h1.className = "user-welcome"
        h1.innerText = `Welcome, ${json.username}!`
        body.prepend(h1)
    }

    //Renders initial html elements for the Users, watch list items, while also adding nav event listeners, based on a conditional. If nav already exsits then overwrites old data with new. 
    const renderItems = (json) => {
        const header = document.getElementById("header")
        let exsitingNav = document.getElementById("item-list-nav")
        if(exsitingNav == null) {
            let nav = document.createElement("nav")
            nav.id = "item-list-nav"
            let ul = document.createElement("ul")
            ul.id = "item-ul"
            nav.appendChild(ul)
            header.appendChild(nav)
            nav.addEventListener("click", (e) => {
                navEventHandler(e, json.watch_items)
            })
        } else {
            exsitingNav.innerHTML = ""
            let ul = document.createElement("ul")
            ul.id = "item-ul"
            exsitingNav.appendChild(ul)
            exsitingNav.addEventListener("click", (e) => {
                navEventHandler(e, json.watch_items)
            })
        }
        renderItemNav(json)
    }

    //Rendering each individual item, in the watch list, from User json data
    const renderItemNav = (json) => {
        let ul = document.getElementById("item-ul")
        json.watch_items.forEach((item) => {
            let li = document.createElement("li")
            li.innerText = item.name
            li.dataset = item.img
            li.id = item.id
            ul.appendChild(li)
        })
    }

    //Creates a base empty div to be used to store items in a Watch List, when user clicks on item from the nav.
    const createItemDiv = () => {
        let itemDiv = document.createElement("div")
        itemDiv.id = "item"
        let h2 = document.createElement("h2")
        h2.id = "watch-list"
        h2.innerText = "Watch List"
        mainDiv.append(itemDiv, h2)
    }

    //Bulk of code functionality linked to both rendering the watch list, and to also make a fetch request to check item in watch list for any cost updates.
    const renderItemDiv = (item) => {

        let itemDiv = document.getElementById("item")
        itemDiv.innerHTML = ""
        // itemDiv.id = item.id

        let h2 = document.getElementById("watch-list")
        h2.innerHTML = ""
        h2.innerHTML = "Watch List"


        let name = document.createElement("h3")
        name.id = item.ASIN
        name.innerText = item.name

        let img = document.createElement("img")
        img.src = item.item_img

        let cost = document.createElement("p")
        cost.innerText = `Cost when added to watch list: $${item.initial_cost}`

        let unitForm = document.createElement("form")
        unitForm.id = "unit-amount-form"

        itemDiv.append(name, img, cost, unitForm)
        mainDiv.appendChild(itemDiv)

        // fetch request needed to get items original cost, when added for use later on in the code lifespan
        fetch(`${itemURL}/${item.id}`)
        .then(res => res.json())
        .then(data => {
            //Storing the data into the dom. 

            let form = document.getElementById("unit-amount-form")
            let label = document.createElement("label")
            form.id = data.user_watch_items[0].id
            label.for ="unit_amount"
            label.innerText = "Unit Amount: "
            let unitAmount = document.createElement("input")
            unitAmount.value = data.user_watch_items[0].unitAmount
            let btn = document.createElement("button")
            btn.input = "submit"
            btn.value = "Update Amount"
            btn.innerText = "Update Amount"
            form.append(label, unitAmount, btn)

        })

        let deleteBtn = document.createElement("button")
        deleteBtn.value = "Delete Item"
        deleteBtn.id = "delete-btn"
        deleteBtn.innerText = "Delete Item"

        let checkPriceBtn = document.createElement("button")
        checkPriceBtn.value = "Check Price"
        checkPriceBtn.id = "check-price-btn"
        checkPriceBtn.innerText = "Check Price"

        itemDiv.append(deleteBtn, checkPriceBtn)

    }

    //Renders the search form that will be attached to freshly clean main Div
    const renderSearch = () => {
        let form = document.createElement("form")
        form.id = "search-form"
        let searchInput = document.createElement("input")
        let searchInputBtn = document.createElement("input")
        let div = document.createElement("div")
        searchInputBtn.type = "submit"
        searchInputBtn.value = "Search"
        div.id = "results-div"
        form.append(searchInput, searchInputBtn)
        mainDiv.append(form, div)
    }

    //Creating the base Div to store all results returned from the fetch request to the API
    const createResultsDiv = () => {  
        let resultsDiv = document.getElementById("results-div")
        resultsDiv.innerHTML = ""
        let h2 = document.createElement("h2")
        h2.id = "results-title"
        h2.innerText = "Results List"
        let div = document.createElement("div")
        div.id = "results-list"
        resultsDiv.append(h2, div)
    }

    //Fetch request to the api to get items from Amazon, that the user would like to add to watch list
    const searchFetch = (input) => {
        createResultsDiv()
        let search = input
        
        fetch(`https://amazon-price1.p.rapidapi.com/search?keywords=${search}&marketplace=US`, {
            "method": "GET",
            "headers": {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": "amazon-price1.p.rapidapi.com"
            }
        })
        .then(response => {
            let temp = response.json()
            return temp
        })
        .then(data => {
            let temp = [...data]
            console.log("temp", temp)
            renderResults(temp)
        })
        .catch(err => {
            console.error(err);
        });
        
    }
    
    //Rendering the results onto the Dom.
    const renderResults = (data) => {
        let listDiv = document.getElementById("results-list")
        listDiv.innerHTML = ""
        let counter = 1
        data.forEach((item) => {
            let div = document.createElement("div")
            div.id = `div${counter}`
            
            let name = document.createElement("h3")
            name.innerText = item.title
            name.dataset.asin = item.ASIN

            let img = document.createElement("img")
            if(item.imageUrl == "") {
                img.src = "./assets/download.png"
            } else {
                img.src = item.imageUrl
            }

            let price = document.createElement("p")
            if(item.price == "") {
                price.innerText = "Cost: Not listable for renting movies or songs"
            } else {
                price.innerText = `Cost: ${item.price}`
            }

            let btn = document.createElement("button")
            btn.id = counter
            btn.innerText = "Add To Watch List"
            btn.value = "Add"

            counter++

            div.append(name, img, price, btn)
            listDiv.appendChild(div)
        })
    }

    //Function to add an item from the search results and add to users watch list.
    const selectItem = (e) => {
        console.log(e)
        let user = parseInt(document.querySelector("body h1").id)
        let asin = e.target.parentElement.children[0].dataset.asin
        let name = e.target.parentElement.children[0].innerText
        let image = e.target.parentElement.children[1].src
        let itemPriceList = e.target.parentElement.children[2].innerText.split("Cost: $")
        let cost = parseFloat(itemPriceList[1])
        
        addItemToWatchList(user, asin, name, image, cost)
    }

    //The Post request to actually add the item selected previously into the database.
    const addItemToWatchList = (user, ASIN, name, item_img, initial_cost) => {
        let data = { name, initial_cost, item_img, ASIN, user }

        let options = {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify(data)
        }
        //My Post fetch request, that runs renders the home page after user creation without refreshing the Dom
        fetch(itemURL, options)
        .then(res => res.json())
        .then(data =>  {
            renderItems(data)
        })
    }

    //Function to update the quantity of the item you would like to watch. Also gives user a window alert when update is sucessfully made.
    const updateItem = (e) => {
        let unitAmount = e.target.parentElement[0].value
    
        let id = e.target.parentElement.id
        let data = {id, unitAmount}

        let options = {
            method: "PATCH",
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify(data)
        }
        fetch(`${joinURL}/${id}`, options)
        .then(res => res.json())
        .then(data =>  {
            window.alert("You have succesfully changed you life")
        })
    }

    //Function that allows user to Delete an item from thier watch list
    const deleteItem = (e) => {
        let id = e.target.parentElement.id  

        let ulObj = e.target.parentElement.parentElement.parentElement.children[1].children[1].children[0].children
        
        let options = {
        method: "DELETE",
        headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
        }
        }
        fetch(`${itemURL}/${id}`, options)
        .then(res => res.json())
        .then(data =>  {
            let currentDiv = document.getElementsByTagName("div")[2]
            let ul = document.getElementById("item-ul")
            let h2 = document.getElementById("watch-list")
            for(let i = 0; i < ulObj.length; i++) {
                if(ulObj[i].innerText == currentDiv.children[0].innerText) {
                    ul.removeChild(ulObj[i])
                    mainDiv.removeChild(currentDiv)
                    mainDiv.removeChild(h2)
                } 
            }
            
        })
    }

    //A function linked to the feature to check an watch list items price to see if the price has lowered from initial addition to watch list.
    const checkPrice = (e) => {
        let item_ASIN = e.target.parentElement.children[0].id
        let cost_str = e.target.parentElement.children[2].innerText
        let num_arr = cost_str.split("$")
        let initial_cost = num_arr[1]

        fetchComparedPrices(item_ASIN, initial_cost)
    }

    //Fetch request made to API, to retrieve most current items, cost from the database
    const fetchComparedPrices = (ASIN, cost) => {
     
        fetch(` https://amazon-price1.p.rapidapi.com/priceReport?asin=${ASIN}&marketplace=US`, {
	        "method": "GET",
            "headers": {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": "amazon-price1.p.rapidapi.com"
            }
        })
        .then(response => {
            // console.log(response.json())
            let temp = response.json()
            return temp
        })
        .then(data => {
            console.log("data", data)
            let temp = {...data}
            console.log("temp", temp)
            comparePrice(temp, cost)
        })
        .catch(err => {
            console.error(err);
        });
    }

    //Function that manipulates API data retrieved and converts that to a readable monetary value, then compares the cost with original added cost and returns a window alert based on the results.
    const comparePrice = (obj, cost) => {
        console.log(obj)
        let obj_cost = String(obj.prices.priceAmazon).split("")
        let cent = []
        cent.push(obj_cost.pop())
        cent.unshift(obj_cost.pop())
        cent = cent.join("")
        obj_cost = obj_cost.join("")
        let current_cost 
        current_cost= current_cost = obj_cost + "." + cent
        current_cost = parseFloat(current_cost)
        cost = parseFloat(cost)

        if (current_cost < cost) {
            window.alert(`${obj.title} is on SALE for $${current_cost}!!!!`)
        } else {
            window.alert(`${obj.title} is on not on SALE`)
        }
    }

    //Toggles the signUp/login buttons to
    const toggleBtn = () => {
        let loginBtn = document.getElementById("login-btn")
        let signUpBtn = document.getElementById("signUp-btn")

        if(loginBtn.className == "" || signUpBtn == "") {
            loginBtn.className = "hidden"
            signUpBtn.className = "hidden"
        } else {
            loginBtn.className = ""
            signUpBtn.className = ""
        }
    }

    //All Event listeners for the main div that are sorted based on event type, value, and id. 
    const eventHandler = (e) => {
        e.preventDefault()

        if (e.target.type === "submit") {
            let loginForm = document.getElementById("login-form")
            let signUpForm = document.getElementById("signUp-form")
            if(e.target.id === "login-btn") {
                toggleBtn()
                //Makes login form appear
                loginForm.className = ""
            }
            else if(e.target.id === "signUp-btn") {
                toggleBtn()
                //Makes sign up form appear
                signUpForm.className = ""
            }
            else if(e.target.value === "Sign Up") {
                let newUser = e.target.parentElement[0].value
                let newFirstName = e.target.parentElement[1].value
                let newLastName = e.target.parentElement[2].value
                signUpUser(newUser, newFirstName, newLastName)
            }
            else if(e.target.value === "Login") {
                let tempUser = e.target.parentElement[0].value
                loginUser(tempUser)
            }
            else if(e.target.value === "Search") {
                //Check to see if search input is empty or not.
                let input = e.target.parentElement[0].value
                if(input == "") {
                    window.alert("Search field cannot be blank.")
                } else {
                    searchFetch(input)
                }
            }
            else if(e.target.value === "Add") {
                selectItem(e)
            }
            else if(e.target.value === "Update Amount") {
                updateItem(e)
            }
            else if(e.target.value === "Delete Item") {
                deleteItem(e)
            }
            else if(e.target.value === "Check Price") {
                checkPrice(e)
            }
            else {
                console.dir(e.target)
            }
        } 
        else {
            return
        }
    }

    //Event handler for the Nav
    const navEventHandler = (e,json) => { 
        e.preventDefault()
        let itemList = json
        itemList.forEach((item) => {
            if(e.target.id == item.id) {
                let itemDiv = document.getElementById("item")
                let h2 = document.getElementById("watch-list")
                if(itemDiv == null && h2 == null) {
                    createItemDiv()
                }
                renderItemDiv(item)
            }
        })
    }
    // Starts the code
    createMainDivEventListener()
})()


