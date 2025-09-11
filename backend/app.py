import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///vendas.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelos
class Produto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    preco = db.Column(db.Float, nullable=False)
    descricao = db.Column(db.String(500))
    categoria = db.Column(db.String(50))
    imagem = db.Column(db.String(200))
    estoque = db.Column(db.Integer, default=0)

class Venda(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.DateTime, default=datetime.utcnow)
    total = db.Column(db.Float, nullable=False)

class ItemVenda(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    venda_id = db.Column(db.Integer, db.ForeignKey('venda.id'), nullable=False)
    produto_id = db.Column(db.Integer, db.ForeignKey('produto.id'), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    preco_unitario = db.Column(db.Float, nullable=False)

# Rotas da API
@app.route('/api/produtos', methods=['GET'])
def listar_produtos():
    produtos = Produto.query.all()
    return jsonify([{
        'id': p.id,
        'nome': p.nome,
        'preco': p.preco,
        'descricao': p.descricao,
        'categoria': p.categoria,
        'imagem': p.imagem,
        'estoque': p.estoque
    } for p in produtos])

@app.route('/api/produtos/<int:id>', methods=['GET'])
def obter_produto(id):
    produto = Produto.query.get_or_404(id)
    return jsonify({
        'id': produto.id,
        'nome': produto.nome,
        'preco': produto.preco,
        'descricao': produto.descricao,
        'categoria': produto.categoria,
        'imagem': produto.imagem,
        'estoque': produto.estoque
    })

@app.route('/api/produtos', methods=['POST'])
def criar_produto():
    dados = request.json
    produto = Produto(
        nome=dados['nome'],
        preco=dados['preco'],
        descricao=dados.get('descricao'),
        categoria=dados.get('categoria'),
        imagem=dados.get('imagem'),
        estoque=dados.get('estoque', 0)
    )
    db.session.add(produto)
    db.session.commit()
    return jsonify({
        'id': produto.id,
        'nome': produto.nome,
        'preco': produto.preco,
        'descricao': produto.descricao,
        'categoria': produto.categoria,
        'imagem': produto.imagem,
        'estoque': produto.estoque
    }), 201

@app.route('/api/vendas', methods=['POST'])
def criar_venda():
    dados = request.json
    itens = dados['itens']
    
    # Calcula o total da venda
    total = sum(item['quantidade'] * item['preco_unitario'] for item in itens)
    
    # Cria a venda
    venda = Venda(total=total)
    db.session.add(venda)
    
    # Adiciona os itens da venda
    for item in itens:
        item_venda = ItemVenda(
            venda_id=venda.id,
            produto_id=item['produto_id'],
            quantidade=item['quantidade'],
            preco_unitario=item['preco_unitario']
        )
        db.session.add(item_venda)
        
        # Atualiza o estoque
        produto = Produto.query.get(item['produto_id'])
        if produto:
            produto.estoque -= item['quantidade']
    
    db.session.commit()
    return jsonify({'id': venda.id, 'total': venda.total}), 201

@app.route('/api/vendas', methods=['GET'])
def listar_vendas():
    vendas = Venda.query.all()
    return jsonify([{
        'id': v.id,
        'data': v.data.isoformat(),
        'total': v.total
    } for v in vendas])

if __name__ == '__main__':
    # Cria o banco de dados se não existir
    with app.app_context():
        db.create_all()
    
    # Inicia o servidor
    app.run(debug=True)
