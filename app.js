// Import the express module
import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

const pool = mysql2.createPool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT

}).promise();

dotenv.config();
// Create an instance of an Express application
const app = express();

app.set('view engine', 'ejs');

// Enable static file serving
app.use(express.static('public'));

// Allow the app to parse form data (req.body)
app.use(express.urlencoded({ extended: true }));

//create an array to store orders
const orders = [];

// Define the port number where our server will listen
const PORT = 3004;

//Define root to test database connection
app.get('/db-test', async(req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders');
        res.send(orders);
    } catch(err) {
        console.error('Database error:', err);
        res.status(500).send('Database error: ' + err.message);
    }
});

// Define a default "route" ('/')
// req: contains information about the incoming request
// res: allows us to send back a response to the client
app.get('/', (req, res) => {

    // Send a response to the client
    // res.send(`<h1>Welcome to Poppa\'s Pizza!</h1>`);
    res.render('home');
});

// define contact us root
app.get('/contact-us', (req, res) => { // root can be a dif name than the .html file
    res.render('contact');
});

// define confirmation us root
app.get('/confirm', (req, res) => { // root can be a dif name than the .html file
    res.render('confirmation');
});

// define confirmation us root
app.get('/admin', async(req, res) => { // root can be a dif name than the .html file
    try {
        const [orders] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC');
        orders.forEach( order => {
            order.formattedTimestamp = newDate(order.timestamp).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        });

        res.render('admin', { orders });
        //res.sendFile(`${import.meta.dirname}/views/admin.html`);

    } catch(err) {
        console.error('Database error:' + err);
        res.status(500).send('Database error: ' + err.message);
    }
});

app.post('/submit-order', async(req, res) => {
    try {
        const order = req.body;

        order.toppings - Array.isArray(order.toppings) ?
        order.toppings.join(", ") : "";
        order.timestamp = new Date();
        console.log('New order recieved:', order);
        const sql = `INSERT INTO orders
        (fname, lname, email, size, method, toppings, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            order.fname,
            order.lname,
            order.email,
            order.size,
            order.method,
            order.toppings,
            order.timestamp
        ];

        const [result] = await pool.execute(sql, params);
        console.log('Order inserted with ID:', result.insertId);
        res.render('confirm', {order: order });
    } catch(err) {
        console.error('Error inserting order:' + err);
        if (err.code == 'ER_DUP_ENTRY') {
            res.status(409).send("An order with this email already exists.");
        } else {
            res.status(500).send('Sorry, there was an error processing your order. Please try again.');
        }
    }
    /*
    // console.log(req.body);
    const order = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        method: req.body.method,
        toppings: req.body.toppings,
        size: req.body.size,
        comment: req.body.comment,
        timestamp: new Date()
    };

    // Array of orders
    orders.push(order);
    console.log(orders);

    res.render('confirmation', { order });
    */
});

// Start the server and make it listen on the port 
// specified above
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}); 
