
/***************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name         : Javier Ricardo Garcia Perez 
* Student ID   : 167379213
* Date         : 7 March 2024
* Published URL: https://ill-ruby-cormorant.cyclic.app
********************************************************************************/
const express = require('express');
const legoData = require('./modules/legoSets');
const app = express();
const port = 8080;
const path = require("path");

app.set('view engine', 'ejs');

// public
app.use(express.static("public"));

legoData.initialize()
    .then(() => {
        console.log('Data initialized successfully.');

        // home
        app.get('/', (req, res) => {
            res.render("main");
        });

        // About
        app.get('/about', (req, res) => {
            res.render("about");
        });

        // Lego sets + theme
        app.get('/lego/sets', (req, res) => {
            const themeQuery = req.query.theme;
            if (themeQuery) {
                legoData.getSetsByTheme(themeQuery)
                    .then(sets => {
                        if (sets.length > 0) {
                            res.render('sets', {sets: sets}); // Render the sets.ejs view with the filtered sets
                        } else {
                            res.status(404).render("404", {message: "No sets found for the specified theme."});
                        }
                    })
                    .catch(error => res.status(404).render("404", {message: "Error fetching sets by theme."}));
            } else {
                legoData.getAllSets()
                    .then(sets => res.render('sets', {sets: sets})) // Render the sets.ejs view with all sets
                    .catch(error => res.status(500).send(error));
            }
        });

        //set_num
        app.get('/lego/sets/:setNum', (req, res) => {
            const setNum = req.params.setNum;
            legoData.getSetByNum(setNum)
                .then(set => {
                    if (set) {
                        res.render('set', { set: set }); // Render the set.ejs view with the retrieved set data
                    } else {
                        res.status(404).render("404", {message: `No set found with number ${setNum}.`});
                    }
                })
                .catch(error => {
                    // Handle the error, such as when the set is not found
                    res.status(404).render("404", {message: `Set with number ${setNum} not found.`});
                });
        });

        // 404 Handler - Updated to include custom messages
        app.use((req, res) => {
            res.status(404).render("404", {message: "The page you are looking for does not exist."});
        });

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(error => {
        console.error('Failed to initialize data:', error);
    });
