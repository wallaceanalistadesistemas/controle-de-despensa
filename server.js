const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Banco de dados
const db = new sqlite3.Database("estoque.db");

// Criação das tabelas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            quantidade INTEGER DEFAULT 0
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS movimentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produto_id INTEGER,
            tipo TEXT,
            quantidade INTEGER,
            data DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// Listar produtos
app.get("/produtos", (req, res) => {
    db.all(`SELECT * FROM produtos`, [], (err, rows) => {
        res.json(rows);
    });
});

// Adicionar entrada ou saída
app.post("/movimento", (req, res) => {
    const { produto_id, tipo, quantidade } = req.body;

    // Atualiza estoque
    const operador = tipo === "entrada" ? "+" : "-";

    db.run(
        `UPDATE produtos SET quantidade = quantidade ${operador} ? WHERE id = ?`,
        [quantidade, produto_id]
    );

    // Registra movimento
    db.run(
        `INSERT INTO movimentos (produto_id, tipo, quantidade) VALUES (?, ?, ?)`,
        [produto_id, tipo, quantidade]
    );

    res.json({ status: "ok" });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
