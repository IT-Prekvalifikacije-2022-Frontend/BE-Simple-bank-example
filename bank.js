const express = require('express')
const cors = require('cors')
const app = express();
app.use(cors())
app.use(express.json()) //naznaka da se podaci salju u JSON formatu
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const users = [
    {id: 1, username: 'Admin', password: 'admin1234', role: 'admin'},
    {id: 2, username: 'Pera', password: 'pera1234', role: 'user'}
]

let transactions = [
    {id: 1, from: 'Petar Petrovic', to: 'Mika Mikic', date: new Date(2023, 0, 12, 10, 30), description: 'Uplata po nalogu gradjana', amount: 3000, status: 'successful'},
    {id: 2, from: 'Marko Markovic', to: 'INFO stan', date: new Date(2023, 2, 12, 10, 30), description: 'Racun za februar mesec', amount: 6370, status: 'successful'},
    {id: 3, from: 'Jasna Jankovic', to: 'Milos Milic', date: new Date(2023, 3, 12, 10, 30), description: 'Uplata po nalogu gradjana', amount: 3000, status: 'unsuccessful'},
    {id: 4, from: 'Jasna Jankovic', to: 'Banka', date: new Date(2023, 0, 12, 10, 30), description: 'Odrzavanje racuna', amount: 350, status: 'successful'},
    {id: 5, from: 'Aca Aleksic', to: 'Pera Peric', date: new Date(), description: 'Uplata po nalogu gradjana', amount: 30000, status: 'successful'},
    {id: 6, from: 'Ana Peric', to: 'Danica Danic', date: new Date(2023, 5, 12, 11, 30), description: 'Uplata po nalogu gradjana', amount: 2500, status: 'unsuccessful'},
    {id: 7, from: 'Dunja Tosic', to: 'Tanja Tasic', date: new Date(2023, 5, 14, 10, 30), description: 'Uplata po nalogu gradjana', amount: 4500, status: 'unsuccessful'},
]

const port = 3003

// logovanje 
// url = 'localhost:3003/api/v1/login'
// method = 'POST'
// body = {
//     username: '',
//     password: ''
// }
app.post('/api/v1/login', (req, res) => {
    console.log(`Logovanje -> ${JSON.stringify(req.body)}`);
    const user = users.find((u) => u.username === req.body.username && u.password === req.body.password);
    if(user){
        res.status(200).send(user);
    }
    res.status(400).send({message: `Korisnicko ime i/ili lozinka nisu ispravni.`})
})

// dobavljanje svih transakcija
// url = 'localhost:3003/api/v1/transaction'
// method = 'GET'
app.get('/api/v1/transaction', (req, res) => {

    console.log('Dobavljanje svih transakcija')
    res.send(transactions)
})

// dobavljanje jedne transakcije na osnovu id
// url = 'localhost:3003/api/v1/login/:id'
// method = 'GET'
// primer: localhost:3003/api/v1/login/2
app.get('/api/v1/transaction/:id', (req, res) => {
    console.log(`Dobavljanje transakcije sa id-om ${req.params.id}`);
    const t = transactions.find((t) => t.id == req.params.id);
    if(t == null){
        res.status(404).send({message: `Transakcija sa id-om ${req.params.id} ne postoji.`});
    }
    res.status(200).send(t);

})


// dodavanje nove transakcije
// url = 'localhost:3003/api/v1/transaction'
// method = 'POST'
// body = {
//     "to" : "Mika",
//     "from" : "Pera", 
//     "status" : "unsuccessful",
//     "amount" : 300,
//     "description" : "Bla truc izmena"
// }
app.post('/api/v1/transaction', (req, res) => {
    console.log(`Dodavanje nove transakcije -> ${JSON.stringify(req.body)}`);
    const new_t = {
        ...req.body, 
        id: transactions.length + 1,
        date: new Date(), //datum ce da bude datum kada se transakcija kreira i to cemo dodati na back-u
    }
    transactions.push(new_t);
    res.status(200).send({message: "Transakcija je uspesno dodata"});
}) 

// izmena postojece transakcije
// url = 'localhost:3003/api/v1/transaction/:id'
// method = 'PUT'
// ovo je samo primer kakve podatke mozete da prosledite u body-u
// body = {
//     "to" : "Mika",
//     "from" : "Pera", 
//     "status" : "successful",
//     "amount" : 300,
//     "description" : "Bla truc izmena"
// }
app.put('/api/v1/transaction/:id', (req, res) => {
    console.log(`Izmena transakcije sa id-om ${req.params.id}`);
    let success_change = false;
    transactions = transactions.map(t => {
        if(t.id == req.params.id){
            success_change = true;
            return {...req.body}
        }
        return t;
    })
    if(success_change)
        res.status(200).send({message: `Transakcija je uspesno izmenjena`});
    else
        res.status(404).send({message: `Transakcija ne postoji`});
})

// url = 'localhost:3003/api/v1/transaction/:id'
// method = 'DELETE'
// primer: 'localhost:3003/api/v1/transaction/8
app.delete('/api/v1/transaction/:id', (req, res) => {
    console.log(`Brisanje transakcije sa id-om ${req.params.id}`)
    transactions = transactions.filter(t => t.id != req.params.id);
    res.status(200).send({message: `Transakcija ${req.params.id} je uspesno obrisana`})
})


app.listen(port, () => {
    console.log(`Bank app listening on port ${port}`)
  })