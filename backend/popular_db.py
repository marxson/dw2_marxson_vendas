from app import db, Produto

# Lista de produtos iniciais
produtos_iniciais = [
    {
        'nome': 'Smartphone XYZ',
        'preco': 1299.99,
        'descricao': 'Smartphone último modelo com câmera de alta resolução',
        'categoria': 'eletronicos',
        'imagem': '../imagen/Smartphone XYZ.jpg',
        'estoque': 10
    },
    {
        'nome': 'Notebook Pro',
        'preco': 4499.99,
        'descricao': 'Notebook profissional com processador de última geração',
        'categoria': 'eletronicos',
        'imagem': '../imagen/Notebook Pro.jpg',
        'estoque': 5
    },
    {
        'nome': 'Camiseta Casual',
        'preco': 49.99,
        'descricao': 'Camiseta confortável para o dia a dia',
        'categoria': 'moda',
        'imagem': '../imagen/Camiseta Casual.jpg',
        'estoque': 50
    },
    {
        'nome': 'Tênis Esportivo',
        'preco': 199.99,
        'descricao': 'Tênis ideal para práticas esportivas',
        'categoria': 'moda',
        'imagem': '../imagen/Tênis Esportivo.jpg',
        'estoque': 20
    },
    {
        'nome': 'Liquidificador Multi',
        'preco': 149.99,
        'descricao': 'Liquidificador com múltiplas velocidades',
        'categoria': 'casa',
        'imagem': '../imagen/Liquidificador Multi.jpg',
        'estoque': 15
    },
    {
        'nome': 'Jogo de Panelas',
        'preco': 299.99,
        'descricao': 'Kit completo de panelas antiaderentes',
        'categoria': 'casa',
        'imagem': '../imagen/Jogo de Panelas.jpg',
        'estoque': 8
    }
]

def popular_banco():
    # Cria o banco de dados
    db.create_all()
    
    # Adiciona os produtos
    for produto_data in produtos_iniciais:
        produto = Produto(**produto_data)
        db.session.add(produto)
    
    # Salva as alterações
    db.session.commit()
    print("Banco de dados populado com sucesso!")
