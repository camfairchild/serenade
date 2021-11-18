import express from 'express';
const app = express();
const port = 3000;

app.use(express.static('pub'));

// redirect to example.html
app.get('/', (req, res) => res.redirect('/example.html'));

app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});