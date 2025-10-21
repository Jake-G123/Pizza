// Import the express module
import express from 'express';

// Create an instance of an Express application
const app = express();

// Enable static file serving
app.use(express.static('public'));

// Allow the app to parse form data (req.body)
app.use(express.urlencoded({ extended: true }));

//create an array to store orders
const orders = [];

// Define the port number where our server will listen
const PORT = 3001;

// Define a default "route" ('/')
// req: contains information about the incoming request
// res: allows us to send back a response to the client
app.get('/', (req, res) => {

    // Send a response to the client
    // res.send(`<h1>Welcome to Poppa\'s Pizza!</h1>`);
    res.sendFile(`${import.meta.dirname}/views/home.html`);
});

// define contact us root
app.get('/contact-us', (req, res) => { // root can be a dif name than the .html file
    res.sendFile(`${import.meta.dirname}/views/contact.html`);
});

// define confirmation us root
app.get('/confirm', (req, res) => { // root can be a dif name than the .html file
    res.sendFile(`${import.meta.dirname}/views/confirmation.html`);
});

// define confirmation us root
app.get('/admin', (req, res) => { // root can be a dif name than the .html file

    res.send(orders);
    //res.sendFile(`${import.meta.dirname}/views/admin.html`);
});

app.post('/submit-order', (req, res) => { // root can be a dif name than the .html file
    res.sendFile(`${import.meta.dirname}/views/confirmation.html`);

    // console.log(req.body);
    const order = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        method: req.body.method,
        toppings: req.body.toppings,
        size: req.body.size,
        comment: req.body.comment
    };

    // Array of orders
    orders.push(order);
    console.log(orders);
});

// Start the server and make it listen on the port 
// specified above
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}); 
