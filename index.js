const express = require('express');

const usersRoutes = require('./routes/users')


const app = express();
const PORT = 3000;

app.get('/hello_world', (req, res) =>{
    res.send("Hey this is my endpoint");
});

app.use('/api', usersRoutes);

app.listen(PORT, ()=>{
    console.log("Express.js App is running at port: " + PORT);
});