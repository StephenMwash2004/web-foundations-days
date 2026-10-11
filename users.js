const loadBtn=document.querySelector("#load-users");
const filterInput=document.querySelector("#filter-input");
const status=document.querySelector("#status");
const userLists=document.querySelector("#users-list");



const renderUsers=(list) =>{
    usersList.innerHTML = "";

    list.foreEach(()=>{
        const li=document.createElement("li");

        const name = document.createElement("h3");
        name.textContent = user.name;

        const email = document.createElement("p");
        email.textContent = `Email: ${user.email}`;

        const city = document.createElement("p");
        city.textContent = `City: ${user.address.city}`;

        const company = document.createElement("p");
        company.textContent = `Company: ${user.company.name}`;


        li.appendChild(name);
        li.appendChild(email);
        li.appendChild(city);
        li.appendChild(company);
    })
}

const fetchUsers=async()=>{

    loadBtn.disabled = true;
    status.textContent = "Loading users...";
    try{
        const response=await fetch("https://jsonplaceholder.typicode.com/users");

        if(!response.ok){
            throw new Error("Failed to fetch users.");
        }
        users=await response.json();

        renderUsers(users);
        status.textContent = `Successfully loaded ${users.length} users.`;
    }
    catch(error){
        status.textContent = "Error loading users.";
    }
    finally{
        loadBtn.disabled = false;
    }
}

loadBtn.addEventListener("click", fetchUsers);

// Filter users without another request
filterInput.addEventListener("input", () => {

    const search = filterInput.value.toLowerCase();

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search)
    );

    renderUsers(filteredUsers);

});