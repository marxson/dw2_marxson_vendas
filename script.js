// Dados dos produtos (simulando um banco de dados)
const produtos = [
    {
        id: 1,
        nome: 'Smartphone XYZ',
        preco: 1299.99,
        imagem: 'imagen/Smartphone XYZ.jpg',
        descricao: 'Smartphone último modelo com câmera de alta resolução',
        categoria: 'eletronicos'
    },
    {
        id: 2,
        nome: 'Notebook Pro',
        preco: 4499.99,
        imagem: 'imagen/Notebook Pro.jpg',
        descricao: 'Notebook profissional com processador de última geração',
        categoria: 'eletronicos'
    },
    {
        id: 3,
        nome: 'Camiseta Casual',
        preco: 49.99,
        imagem: 'imagen/Camiseta Casual.jpg',
        descricao: 'Camiseta confortável para o dia a dia',
        categoria: 'moda'
    },
    {
        id: 4,
        nome: 'Tênis Esportivo',
        preco: 199.99,
        imagem: 'imagen/Tênis Esportivo.jpg',
        descricao: 'Tênis ideal para práticas esportivas',
        categoria: 'moda'
    },
    {
        id: 5,
        nome: 'Liquidificador Multi',
        preco: 149.99,
        imagem: 'imagen/Liquidificador Multi.jpg',
        descricao: 'Liquidificador com múltiplas velocidades',
        categoria: 'casa'
    },
    {
        id: 6,
        nome: 'Jogo de Panelas',
        preco: 299.99,
        imagem: 'imagen/Jogo de Panelas.jpg',
        descricao: 'Kit completo de panelas antiaderentes',
        categoria: 'casa'
    }
];

// Carrinho de compras
let carrinho = [];
let categoriaAtual = 'todos';

// Função para exibir os produtos na página
function exibirProdutos() {
    const produtosGrid = document.getElementById('produtos-grid');
    produtosGrid.innerHTML = '';

    const produtosFiltrados = categoriaAtual === 'todos' 
        ? produtos 
        : produtos.filter(p => p.categoria === categoriaAtual);

    produtosFiltrados.forEach(produto => {
        const produtoCard = document.createElement('div');
        produtoCard.className = 'produto-card';
        produtoCard.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <div class="produto-info">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <div class="produto-preco">R$ ${produto.preco.toFixed(2)}</div>
                <button onclick="adicionarAoCarrinho(${produto.id})" class="btn-comprar">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;
        produtosGrid.appendChild(produtoCard);
    });
}

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
        carrinho.push(produto);
        atualizarCarrinho();
        atualizarContadorCarrinho();
        toggleCarrinho(true);
    }
}

// Função para atualizar o carrinho
function atualizarCarrinho() {
    const carrinhoItems = document.getElementById('carrinho-items');
    const totalSpan = document.getElementById('total');
    
    carrinhoItems.innerHTML = '';
    
    let total = 0;
    
    carrinho.forEach((produto, index) => {
        const item = document.createElement('div');
        item.className = 'carrinho-item';
        item.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <div class="item-info">
                <h4>${produto.nome}</h4>
                <div class="item-preco">R$ ${produto.preco.toFixed(2)}</div>
            </div>
            <button onclick="removerDoCarrinho(${index})" class="btn-remover">
                <i class="fas fa-trash"></i>
            </button>
        `;
        carrinhoItems.appendChild(item);
        total += produto.preco;
    });
    
    totalSpan.textContent = total.toFixed(2);
}

// Função para remover item do carrinho
function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
    atualizarContadorCarrinho();
}

// Função para atualizar o contador do carrinho
function atualizarContadorCarrinho() {
    const contador = document.getElementById('cart-count');
    contador.textContent = carrinho.length;
}

// Função para mostrar/esconder o carrinho
function toggleCarrinho(show = null) {
    const carrinhoSidebar = document.getElementById('carrinho-sidebar');
    const overlay = document.getElementById('overlay');
    
    if (show === null) {
        carrinhoSidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    } else if (show) {
        carrinhoSidebar.classList.add('active');
        overlay.classList.add('active');
    } else {
        carrinhoSidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Função para filtrar produtos por categoria
function filtrarPorCategoria(categoria) {
    categoriaAtual = categoria;
    const botoes = document.querySelectorAll('.category-btn');
    botoes.forEach(btn => {
        if (btn.dataset.category === categoria) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    exibirProdutos();
}

// Função para finalizar a compra
document.getElementById('finalizar-compra').addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    const total = carrinho.reduce((sum, produto) => sum + produto.preco, 0);
    alert(`Compra finalizada com sucesso!\nTotal: R$ ${total.toFixed(2)}`);
    carrinho = [];
    atualizarCarrinho();
    atualizarContadorCarrinho();
    toggleCarrinho(false);
});

// Configurar filtros de categoria
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        filtrarPorCategoria(btn.dataset.category);
    });
});

// Configurar fechamento do carrinho ao clicar no overlay
document.getElementById('overlay').addEventListener('click', () => {
    toggleCarrinho(false);
});

// Configurar busca
document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        categoriaAtual = 'todos';
        exibirProdutos();
        return;
    }

    const produtosGrid = document.getElementById('produtos-grid');
    produtosGrid.innerHTML = '';

    const produtosFiltrados = produtos.filter(produto => 
        produto.nome.toLowerCase().includes(searchTerm) || 
        produto.descricao.toLowerCase().includes(searchTerm)
    );

    if (produtosFiltrados.length === 0) {
        produtosGrid.innerHTML = '<p class="no-results">Nenhum produto encontrado</p>';
        return;
    }

    produtosFiltrados.forEach(produto => {
        const produtoCard = document.createElement('div');
        produtoCard.className = 'produto-card';
        produtoCard.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <div class="produto-info">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <div class="produto-preco">R$ ${produto.preco.toFixed(2)}</div>
                <button onclick="adicionarAoCarrinho(${produto.id})" class="btn-comprar">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;
        produtosGrid.appendChild(produtoCard);
    });
});

// Inicializar a exibição dos produtos
document.addEventListener('DOMContentLoaded', () => {
    exibirProdutos();
    atualizarContadorCarrinho();
});
