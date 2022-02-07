const express = require("express");
const cors = require("cors");
const movies = require("./data/movies.json");
const Database = require("better-sqlite3");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set("view engine", "ejs");

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
	console.log(`Server listening at http://localhost:${serverPort}`);
});

//DATABASE
const db = new Database("./src/database.db", { verbose: console.log });

//ENDPOINTS
server.get("/movie/:movieId", (req, res) => {
	console.log(req.params.movieId);
	const foundMovie = movies.find((movie) => movie.id === req.params.movieId);
	console.log(foundMovie);
	res.render("movie", foundMovie);
});

//FALTA ARREGLAR ESTE ENDPOINT
server.get("/movies", (req, res) => {
	console.log(req.query.gender);
	const gender = req.query.gender;
	const query = db.prepare("SELECT * FROM movies WHERE gender = ?");
	const movieList = query.all(gender);

	res.send({
		movies: movieList,
		success: true,
	});
	/*
	const genderFilterParam = movies.filter(
		(movie) => movie.gender === req.query.gender
	);
	res.send({
		success: true,
		movies: genderFilterParam,
	});*/
});

server.post("/login", (req, res) => {
	if (req.body.email.includes("gmail")) {
		res.json({
			success: true,
			userId: "123",
		});
	} else {
		res.json({
			success: false,
			errorMessage: "Usuario no encontrado",
		});
	}
});

const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

const staticServerPathImages = "./src/public-movies-images";
server.use(express.static(staticServerPathImages));

const staticServerPathCss = "//beta.adalab.es/resources/stylesheets/all.css";
server.use(express.static(staticServerPathCss));
