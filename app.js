import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('pub'));

// redirect to example.html
app.get('*', (req, res) => res.redirect('/examples.html'));

app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});