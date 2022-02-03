const express = require("express");
const cors = require("cors");
const movies = require("./data/movies.json");
// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
	console.log(`Server listening at http://localhost:${serverPort}`);
});

server.get("/movies", (req, res) => {
	console.log(req.query);
	const genderFilterParam = movies.filter(
		(movie) => movie.gender === req.query.gender
	);
	res.send({
		success: true,
		movies: genderFilterParam,
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

const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

const staticServerPathImages = "./src/public-movies-images";
server.use(express.static(staticServerPathImages));
