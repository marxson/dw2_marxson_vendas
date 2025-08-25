// Variáveis globais
let carrinho = [];
let categoriaAtual = 'todos';

// Função para buscar produtos da API
async function buscarProdutos() {
    try {
        const response = await fetch(`${API_URL}/produtos`);
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

// Função para finalizar a compra na API
async function finalizarCompraAPI(itens) {
    try {
        const response = await fetch(`${API_URL}/vendas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itens: itens.map(item => ({
                    produto_id: item.id,
                    quantidade: 1,
                    preco_unitario: item.preco
                }))
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao finalizar compra');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

// Cache de produtos
let produtos = [];

// Carrinho de compras
let carrinho = [];
let categoriaAtual = 'todos';

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
    } catch (error) {
        produtosGrid.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
        console.error('Erro ao exibir produtos:', error);
    }
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
document.getElementById('finalizar-compra').addEventListener('click', async () => {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    try {
        const total = carrinho.reduce((sum, produto) => sum + produto.preco, 0);
        
        // Envia a compra para a API
        const resultado = await finalizarCompraAPI(carrinho);
        
        alert(`Compra finalizada com sucesso!\nTotal: R$ ${total.toFixed(2)}`);
        
        // Limpa o carrinho e atualiza a interface
        carrinho = [];
        atualizarCarrinho();
        atualizarContadorCarrinho();
        toggleCarrinho(false);
        
        // Atualiza a lista de produtos para refletir o novo estoque
        produtos = await buscarProdutos();
        exibirProdutos();
    } catch (error) {
        alert('Erro ao finalizar a compra. Tente novamente.');
        console.error('Erro ao finalizar compra:', error);
    }
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
