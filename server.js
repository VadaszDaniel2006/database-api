const express = require('express');
const sqlite3 = require('sqlite3').verbose(); //Nyomkövetési és hibakeresés támogatása (verbose())
const cors =  require('cors');
const app = express();
const PORT = 3000;

//Middleware - köztes alkalmazások
app.use(express.json());
app.use(cors()); //Cross Origin Resource Sharing

//Az adatbázis (fájl) inicializálása
const db = new sqlite3.Database('test.db', (err) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log('Az adatbázis kapcsolat létrejött.')
    }
});

//Adatbázis séma létrehozása
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName  TEXT NOT NULL,
    lastName TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    gender TEXT NOT NULL
    )`)

//POST végpont az adatok eltárolására a users táblában
app.post('/api/users', (req, res) => {
    const { firstName, lastName, city, address, phone, email, gender } = req.body;

    db.run(`INSERT INTO users (firstName, lastName, city, address, phone, email, gender) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [firstName, lastName, city, address, phone, email, gender],
        //Callback függvény az esetleges adatbázis kapcsolódási hiba kezelésére, vaggy a sikeres adatbázis művelet eredményének a visszaadaására
        function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Hiba történt az adatok rögzítése során!' })
            }
            else {
                return res.status(201).send({ message: 'Az adatok rögzítése sikeres volt.', id: this.lastID, firstName, lastName, city, address, phone, email, gender })
            }
        }
    )
})

//Get végpont adatabázis lekérdezése
app.get('/api/users', (req,res) => {
    db.all('SELECT * FROM users', [],(err,records) => {
        if (err) {
            console.error(err);
            return res.status(500).json({message: 'Hiba történt az adatok kiolvasása során!'});
        } else {
            //Hibakereséshez az adatok kilogolása a konzolra
              console.log('Az adatbázisunk sorai ' , records);
             return res.status(200).json(records);
        }
       
    })
  
})

//DELETE végpont az adatbázis egy sorának(id szerinti) törlésére
app.delete('/api/users/:id', (req,res) => {
    //Az id elérése az URL paraméter listájában
    const {id} = req.params;

    //Az adatbázis sprának a törlése
    db.run('DELETE FROM users WHERE id = ?', [id], 
        //Callback függvény a hibakezelésre vagy a sikeres művelet nyugtázására
        function (err) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.status(200).json({ message:'Sikeres adattörlés'})
        }
    }
    )

})

//PUT végpont a táblázat adatainak a módosítására
app.put('/api/users/:id', (req,res) => {
    const { id } = req.params; //id elérése az URL paramétert listájából
    const { firstName, lastName, city, address, phone, email, gender } = req.body; //Az adatok kinyerése a kliens üzenet törzséből
    const url = 'UPDATE users SET firstName = ?, lastName = ?,city = ?, address = ? , phone = ?, email = ?,gender = ? WHERE id = ?';
    db.run(url, [ firstName, lastName, city, address, phone, email, gender, id],
        function (err) {
            if ( err) {
                return res.status(500).send(err.message);
            } else {
                res.status(200).send({  message: 'A felhasználók frissítése megtörtént!', id, firstName, lastName, city, address, phone, email, gender });
            }
        }
    )

})


//Szerver elindítása
app.listen(PORT, () => {
    console.log(`A webszerver fut a http://localhost:${PORT} webcímen.`)
})
