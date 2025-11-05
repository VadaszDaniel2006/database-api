//REST Frontend - HTML kliens, az API elérésére és az adatbázis műveletekre

const apiUrl = 'http://localhost:3000/api/users'  //Az API elérési utvonala
const usersData = document.getElementById('usersData') //AZ outpot tábla törzse

//Az API elérése és az adatok lekérése

//Az adatok lekérése szolgáló függvény
async function getUsers() {
    try{
        const response = await fetch(apiUrl); //Kapcsolódás az API-hoz
        const users = await response.json();  //Az adatok lekérése APi-ról (a users egy tömb)
        
        //A user egy objektum
        usersData.innerHTML = users.map(user => ` 
            <tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.city}</td>
            <td>${user.address}</td>
            <td>${user.phone}</td>
            <td>${user.email}</td>
            <td>${user.gender}</td>
            <td>${user.actions}</td>
            </tr>
            `).join('');
    }
    catch(e) {
        console.error(e.message); //Hiba üzenet küldése a konzolra fejlesztéshez
        alert ('Hiba történt az adatok elérése során!');

    }
}

getUsers(); //Az adatok lekérése szolgáló függvény meghívása
