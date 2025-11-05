//REST Frontend - HTML kliens, az API elérésére és az adatbázis műveletekre

const apiUrl = 'http://localhost:3000/api/users'  //Az API elérési utvonala
const usersData = document.getElementById('usersData') //AZ outpot tábla törzse

//Az API elérése és az adatok lekérése

//Az adatok lekérése szolgáló függvény
async function getUsers() {
    try{
        const response = await fetch(apiUrl); //Kapcsolódás az API-hoz
        const users = await response.json
    }
    catch(e) {

    }
}