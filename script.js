// Produtos default
let produtos = JSON.parse(localStorage.getItem("produtos")) || [
    { id: 1, nome: "Café", quantidade: 0, imagem: "img/cafe.png" },
    { id: 2, nome: "Biscoito", quantidade: 0, imagem: "img/biscoito.png" },
    { id: 3, nome: "Filtro", quantidade: 0, imagem: "img/filtro.png" },
    { id: 4, nome: "Achocolatado", quantidade: 0, imagem: "img/achocolatado.png" }
];


// Carregar do localStorage, se existir
if (localStorage.getItem("estoque")) {
    JSON.parse(localStorage.getItem("estoque"));
}

function salvar() {
    localStorage.setItem("produtos", JSON.stringify(produtos));
}


function atualizarTabela() {
    const tbody = document.querySelector("#tabelaEstoque tbody");
    tbody.innerHTML = "";

    produtos.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td class="produto-cell">
                    <img src="${p.imagem}" class="produto-img">
                    <span>${p.nome}</span>
                </td>
                <td>${p.quantidade}</td>
            </tr>
        `;
    });

    carregarSelect();
}


function carregarSelect() {
    const select = document.getElementById("produtoSelect");
    select.innerHTML = "";

    produtos.forEach(prod => {
        select.innerHTML += `<option value="${prod.id}">${prod.nome}</option>`;
    });
}

function registrarMovimento() {
    const id = parseInt(document.getElementById("produtoSelect").value);
    const tipo = document.getElementById("tipoMovimento").value;
    const quantidade = parseInt(document.getElementById("quantidade").value);

    if (!quantidade || quantidade <= 0) {
        alert("Digite uma quantidade válida.");
        return;
    }

    const produto = produtos.find(p => p.id === id);

    if (tipo === "entrada") {
        produto.quantidade += quantidade;
    } else {
        if (produto.quantidade < quantidade) {
            alert("Estoque insuficiente!");
            return;
        }
        produto.quantidade -= quantidade;
    }

    function adicionarProduto() {
    const nome = document.getElementById("novoProdutoNome").value.trim();
    const qtd = parseInt(document.getElementById("novoProdutoQtd").value);
    const img = document.getElementById("novoProdutoImg").value.trim();

    if (!nome) return alert("Digite o nome do produto.");
    if (isNaN(qtd) || qtd < 0) return alert("Quantidade inválida.");
    if (!img) return alert("Informe uma imagem para o produto.");

    const novo = {
        id: produtos.length + 1,
        nome,
        quantidade: qtd,
        imagem: img
    };

    produtos.push(novo);
    salvar();
    atualizarTabela();

    document.getElementById("novoProdutoNome").value = "";
    document.getElementById("novoProdutoQtd").value = "";
    document.getElementById("novoProdutoImg").value = "";

    alert("Produto adicionado com sucesso!");
}


    salvar();
    atualizarTabela();
    document.getElementById("quantidade").value = "";
    alert("Movimento registrado com sucesso!");
}

// Inicializar
atualizarTabela();
carregarSelect();
