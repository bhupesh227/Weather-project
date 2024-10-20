import express from "express"
import axios from "axios"
import dotenv from "dotenv"
import bodyParser from "body-parser";

// Load environment variables from .env file
dotenv.config();

const app=express();
const port=3000; 

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", async (req, res) => {
    const city = req.query.city;
    let weath = null;
    let error = null;

    if (city) {
        const API_KEY= process.env.API_KEY;
        const apiUrl = `https://api.weatherbit.io/v2.0/current?key=${API_KEY}&city=${city}`;
        try {
            const response = await axios.get(apiUrl);
            weath = response.data;
        } catch (error) {
            console.error("Failed to fetch weather data", error);
            error = "Could not fetch weather data. Please try again.";
        }
    }

    res.render("index.ejs", {
        weath: weath,
        error: error,
    });
});

app.post("/search", async (req, res) => {
    const city = req.body.search;
    // Redirect to the home page with the city as a query parameter
    res.redirect(`/?city=${city}`);
});

app.get("/geo", async (req, res) => {
    const { lat, lon } = req.query;
    const API_KEY= process.env.API_KEY;
    const apiUrl = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${API_KEY}`;
    
    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error("Failed to fetch weather data", error);
        res.status(500).json({ error: "Could not fetch weather data. Please try again." });
    }
});

//about
app.get("/about",(req,res)=>{
    res.render("about.ejs");
 });
    
app.listen(port,()=>{
    console.log("working in port 3000");
});