const express = require('express');
const path = require('path');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3')
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json()); 

const dbPath = path.join(__dirname,"database.db");

let db = null 

const initializeDbAndServer = async ()=>{
    try{
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database,
        }) 
        app.listen(4000,()=>{
            console.log(`server running at http://localhost:4000`)
        })
    }catch(e){
        console.log(`DB Error :${e.message}`);
        process.exit(1)
    }
}


initializeDbAndServer()

app.get("/login1/", async (req, res) => {
  
    const getQueryDatta = "SELECT * FROM  login1";
    const datas = await db.all(getQueryDatta);

    res.send(datas);
});


  app.post('/login1/', async (req, res) => {
    try {
      const { name, password } = req.body;
      const query = 'INSERT INTO login1(name, password) VALUES (?, ?)';
      const result = await db.run(query, [name, password]);
      if (result.lastID) {
        res.status(200).send('Login successful!');
      } else {
        res.status(401).send('Failed to add user');
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error');
    }
  });
