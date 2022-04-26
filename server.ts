import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config();
const client = new Client({ database: 'perntodo' });

//middleware
const app = express();
app.use(express.json()) //req.body;
app.use(cors());

client.connect();

//ROUTES//

// get a todo
app.get("/todolist" , async (req, res) => {
  const allToDos = await client.query('SELECT * FROM todo');
  const result = allToDos.rows
  res.status(200).json({
    data: result
  })
});

// create a to do
app.post("/todolist", async(req, res) => {

    const {description} = req.body;
    const text = "INSERT INTO todo (description) VALUES ($1) RETURNING *";
    const values = [`${description}`]
    const result = await client.query(text, values)
    const newToDo = result.rows[0]
    res.status(200).json({
    data:{
      status: "success",
       description: newToDo
    }});
  });

//delete a to do
app.delete("/todolist/:id", async (req, res) => {
  const id = req.params.id;
  const text = "DELETE FROM todo WHERE id = $1 RETURNING *";
  const value = [`${id}`];
  const result = await client.query(text, value);
  const didRemove = result.rowCount === 1;
  if (didRemove){
    res.status(200).json({
      status:"successfully deleted"
    })
  }
})


// use the environment variable PORT, or 5000 as a fallback
const PORT_NUMBER = 5000;
app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});