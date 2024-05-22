const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI

try {
    mongoose.connect(mongoUri);
    console.log("Conectado a MongoDB");
} catch (error) {
    console.log("Error de conexión", error);
}

const libroSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
});

const Libro = mongoose.model("Libro", libroSchema);

const libros = [
    {id: 1, titulo: "1984", autor: "George Orwel"},
    {id: 2, titulo: "Cien años de soledad", autor: "Gabriel Garcia Marquez"},
    {id: 3, titulo: "Dune", autor: "Frank Herbert"}
]

app.get("/", (req, res) => {
    res.send("Bienvenidos a la tienda de libros");
})

app.get("/libros", (req, res) => {
    res.json(libros);
})

app.get("/libros/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const libro = libros.find((libro) => libro.id === id)
    if (libro) {
        res.json(libro);
    }else {
        res.status(404).send("Libro no encontrado");
    }
})

//Crear un nuevo libro
app.post("/libros", async (req, res) => {
    const libro = new Libro({
        titulo: req.body.titulo,
        autor: req.body.autor,
    })

    try {
        await libro.save();
        res.json(libro);
    } catch (error) {
        res.status(500).send("Error al guardar libro");
    }
});

//Traer un listado de todos los libros
app.get ("/libros", async (req, res) => {
    try {
        const libro = await Libro.find();
        res.json(libros);
    } catch (error) {
        res.status(500).send("Error al obtene los libros", error);
    }
});

module.exports = app;