import os

from dotenv import load_dotenv
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import (
    LoginManager, login_user, login_required, logout_user, current_user,
)
from flask_wtf import CSRFProtect
from werkzeug.security import generate_password_hash, check_password_hash

from models import db, Usuario, Mensagem, Torneio, Resultado, ESPORTES

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'chave-de-desenvolvimento')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sportlife.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
csrf = CSRFProtect(app)

login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Faça login para continuar.'


@login_manager.user_loader
def carregar_usuario(id):
    return Usuario.query.get(int(id))


@app.context_processor
def injetar_globais():
    return {'todos_esportes': ESPORTES}


# ---------- HOME ----------

@app.route('/')
def home():
    if current_user.is_authenticated:
        return redirect(url_for('chat'))
    return render_template('home.html')


# ---------- AUTENTICAÇÃO ----------

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        nome = request.form['nome'].strip()
        email = request.form['email'].strip().lower()
        senha = request.form['senha']
        confirmar_senha = request.form.get('confirmar_senha', '')

        if len(senha) < 6:
            flash('A senha precisa ter pelo menos 6 caracteres.')
            return redirect(url_for('cadastro'))

        if senha != confirmar_senha:
            flash('As senhas não coincidem.')
            return redirect(url_for('cadastro'))

        if Usuario.query.filter_by(email=email).first():
            flash('Já existe uma conta com esse email.')
            return redirect(url_for('cadastro'))

        usuario = Usuario(nome=nome, email=email, senha=generate_password_hash(senha))
        db.session.add(usuario)
        db.session.commit()

        login_user(usuario)
        return redirect(url_for('perfil'))

    return render_template('cadastro.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email'].strip().lower()
        senha = request.form['senha']

        usuario = Usuario.query.filter_by(email=email).first()

        if not usuario or not check_password_hash(usuario.senha, senha):
            flash('Email ou senha incorretos.')
            return redirect(url_for('login'))

        login_user(usuario)
        return redirect(url_for('chat'))

    return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))


# ---------- CHAT (marcar prática/amistoso) ----------

@app.route('/chat')
@login_required
def chat():
    esporte = request.args.get('esporte')

    query = Mensagem.query
    if esporte:
        query = query.filter_by(esporte=esporte)

    mensagens = query.order_by(Mensagem.id.desc()).limit(100).all()

    return render_template('chat.html', mensagens=mensagens, esporte_filtro=esporte)


@app.route('/chat/nova', methods=['POST'])
@login_required
def nova_mensagem():
    texto = request.form.get('texto', '').strip()

    if not texto:
        flash('Escreva uma mensagem antes de enviar.')
        return redirect(url_for('chat'))

    mensagem = Mensagem(
        texto=texto[:500],
        esporte=request.form.get('esporte') or None,
        local=request.form.get('local', '').strip()[:120] or None,
        data_sugerida=request.form.get('data_sugerida', '').strip()[:40] or None,
        autor_id=current_user.id,
    )
    db.session.add(mensagem)
    db.session.commit()

    return redirect(url_for('chat'))


@app.route('/chat/<int:id>/excluir', methods=['POST'])
@login_required
def excluir_mensagem(id):
    mensagem = Mensagem.query.get_or_404(id)

    if mensagem.autor_id != current_user.id:
        flash('Você só pode excluir suas próprias mensagens.')
        return redirect(url_for('chat'))

    db.session.delete(mensagem)
    db.session.commit()
    return redirect(url_for('chat'))


# ---------- TORNEIOS ----------

@app.route('/torneios')
def torneios():
    lista = Torneio.query.order_by(Torneio.id.desc()).all()
    return render_template('torneios.html', torneios=lista)


@app.route('/torneios/novo', methods=['GET', 'POST'])
@login_required
def criar_torneio():
    if request.method == 'POST':
        nome = request.form.get('nome', '').strip()
        esporte = request.form.get('esporte')

        if not nome or esporte not in ESPORTES:
            flash('Preencha ao menos o nome e o esporte do torneio.')
            return redirect(url_for('criar_torneio'))

        torneio = Torneio(
            nome=nome[:120],
            esporte=esporte,
            data=request.form.get('data', '').strip()[:40] or None,
            local=request.form.get('local', '').strip()[:120] or None,
            descricao=request.form.get('descricao', '').strip()[:400] or None,
            criador_id=current_user.id,
        )
        db.session.add(torneio)
        db.session.commit()
        flash('Torneio criado!')
        return redirect(url_for('torneios'))

    return render_template('criar_torneio.html')


@app.route('/torneios/<int:id>/excluir', methods=['POST'])
@login_required
def excluir_torneio(id):
    torneio = Torneio.query.get_or_404(id)

    if torneio.criador_id != current_user.id:
        flash('Você só pode excluir torneios que você criou.')
        return redirect(url_for('torneios'))

    db.session.delete(torneio)
    db.session.commit()
    return redirect(url_for('torneios'))


# ---------- REELS (resultados) ----------

@app.route('/reels')
def reels():
    esporte = request.args.get('esporte')

    query = Resultado.query
    if esporte:
        query = query.filter_by(esporte=esporte)

    resultados = query.order_by(Resultado.id.desc()).all()

    return render_template('reels.html', resultados=resultados, esporte_filtro=esporte)


@app.route('/reels/novo', methods=['GET', 'POST'])
@login_required
def criar_resultado():
    if request.method == 'POST':
        esporte = request.form.get('esporte')
        participantes = request.form.get('participantes', '').strip()

        if esporte not in ESPORTES or not participantes:
            flash('Preencha ao menos o esporte e quem participou.')
            return redirect(url_for('criar_resultado'))

        torneio_id = request.form.get('torneio_id') or None

        resultado = Resultado(
            esporte=esporte,
            participantes=participantes[:150],
            placar=request.form.get('placar', '').strip()[:60] or None,
            data=request.form.get('data', '').strip()[:40] or None,
            observacao=request.form.get('observacao', '').strip()[:300] or None,
            torneio_id=int(torneio_id) if torneio_id else None,
            autor_id=current_user.id,
        )
        db.session.add(resultado)
        db.session.commit()
        flash('Resultado publicado!')
        return redirect(url_for('reels'))

    torneios_disponiveis = Torneio.query.order_by(Torneio.nome).all()
    return render_template('criar_resultado.html', torneios=torneios_disponiveis)


@app.route('/reels/<int:id>/excluir', methods=['POST'])
@login_required
def excluir_resultado(id):
    resultado = Resultado.query.get_or_404(id)

    if resultado.autor_id != current_user.id:
        flash('Você só pode excluir resultados que você publicou.')
        return redirect(url_for('reels'))

    db.session.delete(resultado)
    db.session.commit()
    return redirect(url_for('reels'))


# ---------- PERFIL ----------

@app.route('/perfil', methods=['GET', 'POST'])
@login_required
def perfil():
    if request.method == 'POST':
        idade = request.form.get('idade', '').strip()
        current_user.idade = int(idade) if idade.isdigit() else None
        current_user.bio = request.form.get('bio', '').strip()[:200]
        current_user.esportes = ','.join(request.form.getlist('esportes'))

        db.session.commit()
        flash('Perfil atualizado!')
        return redirect(url_for('perfil'))

    minhas_mensagens = Mensagem.query.filter_by(autor_id=current_user.id).count()
    meus_resultados = Resultado.query.filter_by(autor_id=current_user.id).count()

    return render_template(
        'perfil.html',
        minhas_mensagens=minhas_mensagens,
        meus_resultados=meus_resultados,
    )


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=os.environ.get('FLASK_DEBUG') == '1')
