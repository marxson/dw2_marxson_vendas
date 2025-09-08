// Variáveis globais
let carrinho = [];
let categoriaAtual = 'todos';
let proximoId = 6; // Começa em 6 pois já temos 5 produtos

// Lista de produtos iniciais
const produtosIniciais = [
    {
        id: 1,
        nome: "Smartphone XYZ",
        preco: 1299.99,
        imagem: "imagen/Smartphone XYZ.jpg",
        categoria: "eletronicos",
        descricao: "Smartphone último modelo com câmera de alta resolução"
    },
    {
        id: 2,
        nome: "Notebook Pro",
        preco: 4499.99,
        imagem: "imagen/Notebook Pro.jpg",
        categoria: "eletronicos",
        descricao: "Notebook profissional com processador de última geração"
    },
    {
        id: 3,
        nome: "Camiseta Casual",
        preco: 49.99,
        imagem: "imagen/Camiseta Casual.jpg",
        categoria: "moda",
        descricao: "Camiseta confortável para o dia a dia"
    },
    {
        id: 4,
        nome: "Tênis Esportivo",
        preco: 199.99,
        imagem: "imagen/Tênis Esportivo.jpg",
        categoria: "moda",
        descricao: "Tênis ideal para práticas esportivas"
    },
    {
        id: 5,
        nome: "Liquidificador Multi",
        preco: 149.99,
        imagem: "imagen/Liquidificador Multi.jpg",
        categoria: "casa",
        descricao: "Liquidificador com múltiplas velocidades"
    }
];

// Carregar produtos do localStorage ou usar os produtos iniciais
let produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
if (produtos.length === 0) {
    produtos = produtosIniciais;
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Atualizar o próximo ID baseado nos produtos existentes
proximoId = Math.max(...produtos.map(p => p.id)) + 1;

// Função para filtrar os produtos
function filtrarProdutos() {
    const cards = document.querySelectorAll('.produto-card');
    
    cards.forEach(card => {
        const categoria = card.getAttribute('data-categoria');
        if (categoriaAtual === 'todos' || categoria === categoriaAtual) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
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
                <button class="btn-remover" onclick="removerDoCarrinho(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        carrinhoItems.appendChild(item);
        total += produto.preco;
    });
    
    totalSpan.textContent = `R$ ${total.toFixed(2)}`;
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

// Função para alternar a visibilidade do carrinho
function toggleCarrinho(forceOpen = false) {
    const carrinhoSidebar = document.getElementById('carrinho-sidebar');
    if (forceOpen) {
        carrinhoSidebar.classList.add('open');
    } else {
        carrinhoSidebar.classList.toggle('open');
    }
}

// Função para adicionar novo produto
function adicionarNovoProduto(event) {
    event.preventDefault();
    
    // Pegar os valores do formulário
    const nome = document.getElementById('nome').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const categoria = document.getElementById('categoria').value;
    const descricao = document.getElementById('descricao').value;
    const imagem = document.getElementById('imagem').value;
    
    // Recarregar produtos atuais do localStorage
    produtos = JSON.parse(localStorage.getItem('produtos') || '[]');

    // Atualizar proximoId baseado nos produtos existentes para evitar duplicatas
    if (produtos && produtos.length > 0) {
        proximoId = Math.max(...produtos.map(p => p.id)) + 1;
    }

    // Criar novo produto
    const novoProduto = {
        id: proximoId++,
        nome: nome,
        preco: preco,
        descricao: descricao,
        imagem: imagem,
        categoria: categoria
    };
    
    // Adicionar à lista de produtos no localStorage e na memória
    produtos.push(novoProduto);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    
    // Atualizar a lista de produtos e exibir na tela
    alert('Produto adicionado com sucesso!');
    
    // Se estivermos na página principal, atualizar a exibição
    const produtosGrid = document.getElementById('produtos-grid');
    if (produtosGrid) {
        exibirProdutos();
    } else {
        // Se estivermos na página de adicionar produto, redirecionar
        window.location.href = 'index.html';
    }
}
// Função para renderizar produtos na vitrine
function exibirProdutos() {
    const produtosGrid = document.getElementById('produtos-grid');
    if (!produtosGrid) return;
    
    // Recarregar produtos do localStorage antes de exibir
    produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
    if (produtos.length === 0) {
        produtos = produtosIniciais;
    }
    produtosGrid.innerHTML = '';

    produtos.forEach(produto => {
        if (categoriaAtual !== 'todos' && produto.categoria !== categoriaAtual) return;

        const produtoCard = document.createElement('div');
        produtoCard.className = 'produto-card';
        produtoCard.setAttribute('data-categoria', produto.categoria || '');
        produtoCard.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <div class="produto-info">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao || ''}</p>
                <div class="produto-preco">R$ ${produto.preco.toFixed(2)}</div>
                <button onclick="adicionarAoCarrinho(${produto.id})" class="btn-comprar">Adicionar ao Carrinho</button>
            </div>
        `;
        produtosGrid.appendChild(produtoCard);
    });
}

// Finalizar compra (simples, sem API)
const btnFinalizar = document.getElementById('finalizar-compra');
if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        const total = carrinho.reduce((sum, p) => sum + p.preco, 0);
        alert(`Compra finalizada com sucesso!\nTotal: R$ ${total.toFixed(2)}`);
        carrinho = [];
        atualizarCarrinho();
        atualizarContadorCarrinho();
        // fechar carrinho se estiver aberto
        const overlay = document.getElementById('overlay');
        const carrinhoSidebar = document.getElementById('carrinho-sidebar');
        if (overlay) overlay.classList.remove('active');
        if (carrinhoSidebar) carrinhoSidebar.classList.remove('active');
    });
}

// Botões de categoria
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        categoriaAtual = btn.dataset.category;
        document.querySelectorAll('.category-btn').forEach(b => b.classList.toggle('active', b === btn));
        exibirProdutos();
    });
});

// Fechar carrinho ao clicar no overlay (se existir)
const overlayEl = document.getElementById('overlay');
if (overlayEl) overlayEl.addEventListener('click', () => {
    const carrinhoSidebar = document.getElementById('carrinho-sidebar');
    if (carrinhoSidebar) carrinhoSidebar.classList.remove('active');
    overlayEl.classList.remove('active');
});

// Busca
const searchBtn = document.getElementById('search-button');
if (searchBtn) searchBtn.addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    if (searchTerm.trim() === '') {
        categoriaAtual = 'todos';
        exibirProdutos();
        return;
    }

    const produtosGrid = document.getElementById('produtos-grid');
    produtosGrid.innerHTML = '';

    const produtosFiltrados = produtos.filter(produto =>
        (produto.nome || '').toLowerCase().includes(searchTerm) ||
        (produto.descricao || '').toLowerCase().includes(searchTerm)
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
                <p>${produto.descricao || ''}</p>
                <div class="produto-preco">R$ ${produto.preco.toFixed(2)}</div>
                <button onclick="adicionarAoCarrinho(${produto.id})" class="btn-comprar">Adicionar ao Carrinho</button>
            </div>
        `;
        produtosGrid.appendChild(produtoCard);
    });
});

// Inicializar a exibição dos produtos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // recarrega produtos do localStorage (em caso de redirecionamento após salvar)
    produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
    if (!produtos || produtos.length === 0) {
        produtos = produtosIniciais;
        localStorage.setItem('produtos', JSON.stringify(produtos));
    }
    proximoId = Math.max(...produtos.map(p => p.id)) + 1;
    
    // Verificar se estamos na página principal
    if (document.getElementById('produtos-grid')) {
        exibirProdutos();
        atualizarContadorCarrinho();
    }
});
