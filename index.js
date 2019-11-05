const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const greetings = require("./greetLogic");
const flash = require('express-flash');
const session = require('express-session');
const greetApp = express();



const pg = require('pg')

const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL ||'postgresql://codex:codex123@localhost:5432/greetings';
const pool = new Pool({
    connectionString
})

const greeting = greetings(pool);
const add = require("./greetRouter");
const tag = add(greeting);
greetApp.use(session({
    secret: 'greet',
    resave: false,
    saveUninitialized: true
}));

greetApp.use(flash());

const handlebarsSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: "./views",
    layoutsDir: "./views/layouts"
});
greetApp.engine('handlebars', handlebarsSetup);
greetApp.set("view engine", "Handlebars")
greetApp.use(bodyParser.urlencoded({
    extended: false
}));
greetApp.use(bodyParser.json())

greetApp.use(express.static("Public"))

greetApp.set('view engine', 'handlebars');

greetApp.get("/", tag.index);

greetApp.get("/greeted", async function (req, res) {
    res.render('actions', {
        actions: await greeting.getGreet()
    })
})


greetApp.post("/back_Button", function (req, res) {
    res.redirect('/greeted')
})

greetApp.post("/back", function (req, res) {
    res.redirect('/')
})

greetApp.post("/greeted", async function (req, res) {
    if (req.body.fname === "") {
        req.flash('error', 'Please enter a Name')
        res.redirect("/");
    }
    if (req.body.greet === undefined) {
        req.flash('error', 'Select a language')
        res.redirect("/");
    } else {
        await greeting.greetInput(req.body.greet, req.body.fname)
        res.redirect("/");
    }
});
greetApp.post("/resetBtn", async function (req, res) {
    await greeting.resetbtn()
    res.redirect("/");
});
greetApp.get("/count/:name", async function (req, res) {
    var name = req.params.name
    let user_count = await greeting.counter(name)
    if (user_count) {
        res.render("greetmessage", {
            namesGreet: await greeting.greetedinput(),
            counting: user_count,
            name
        })
    } else {
        res.redirect('/')
    }

})


let PORT = process.env.PORT || 3000;


greetApp.listen(PORT, function () {
    console.log("Greetingapp", PORT)
});