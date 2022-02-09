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

	const query = db.prepare(`SELECT * FROM movies WHERE id = ? `);
	const foundMovie = query.get(req.params.movieId);
	res.render("movie", foundMovie);
});

server.get("/movies", (req, res) => {
	console.log(req.query.gender);
	const gender = req.query.gender;
	const sort = req.query.sort;
	console.log(sort);
	let movieList;
	if (gender === "") {
		const query = db.prepare(`SELECT * FROM movies ORDER BY title ${sort}`);
		movieList = query.all();
	} else {
		const query = db.prepare(
			`SELECT * FROM movies WHERE gender = ? ORDER BY title ${sort}`
		);
		movieList = query.all(gender);
	}
	res.json({
		movies: movieList,
		success: true,
	});
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

server.post("/sign-up", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const query = db.prepare("INSERT INTO users (email,password) VALUES (?,?)");
	const userInsert = query.run(email, password);
	res.json({
		success: true,
		userId: userInsert.lastInsertRowid,
	});
});

const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

const staticServerPathImages = "./src/public-movies-images";
server.use(express.static(staticServerPathImages));

const staticServerPathCss = "//beta.adalab.es/resources/stylesheets/all.css";
server.use(express.static(staticServerPathCss));
