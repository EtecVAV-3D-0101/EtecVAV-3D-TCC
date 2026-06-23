from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
from flask import url_for
from flask import flash

from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash

from flask_login import LoginManager
from flask_login import login_user
from flask_login import logout_user
from flask_login import login_required
from flask_login import current_user

from models import *

app = Flask(__name__)

app.config['SECRET_KEY'] = 'sportlife2026'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sportlife.db'

db.init_app(app)

login_manager = LoginManager()

login_manager.init_app(app)

login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))


with app.app_context():
    db.create_all()


# HOME

@app.route('/')
def home():

    posts = Post.query.all()

    return render_template(
        'home.html',
        posts=posts
    )


# LOGIN

@app.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == 'POST':

        email = request.form['email']

        senha = request.form['senha']

        usuario = Usuario.query.filter_by(
            email=email
        ).first()

        if usuario and check_password_hash(
                usuario.senha,
                senha):

            login_user(usuario)

            return redirect('/')

        flash('Email ou senha inválidos')

    return render_template('login.html')


# LOGOUT

@app.route('/logout')
@login_required
def logout():

    logout_user()

    return redirect('/')


# CADASTRO


@app.route('/cadastro',
           methods=['GET', 'POST'])
def cadastro():

    if request.method == 'POST':

        nome = request.form['nome']
        email = request.form['email']
        senha = request.form['senha']

        # Verificar se email já existe
        usuario_existente = Usuario.query.filter_by(
            email=email
        ).first()

        if usuario_existente:
            flash('Email já cadastrado!')
            return redirect('/cadastro')

        usuario = Usuario(
            nome=nome,
            email=email,
            senha=generate_password_hash(senha)
        )

        db.session.add(usuario)
        db.session.commit()

        flash('Cadastro realizado com sucesso!')
        return redirect('/login')

    return render_template('cadastro.html')


# FEED

@app.route('/feed')
def feed():

    posts = Post.query.all()

    return render_template(
        'feed.html',
        posts=posts
    )


# CRIAR POST

@app.route('/criar-post',
           methods=['GET', 'POST'])
@login_required
def criar_post():

    if request.method == 'POST':

        post = Post(

            titulo=request.form['titulo'],

            descricao=request.form['descricao'],

            usuario_id=current_user.id

        )

        db.session.add(post)

        db.session.commit()

        return redirect('/feed')

    return render_template(
        'criar_post.html'
    )


# EXCLUIR POST

@app.route('/excluir-post/<int:id>')
@login_required
def excluir_post(id):

    post = Post.query.get_or_404(id)

    db.session.delete(post)

    db.session.commit()

    return redirect('/feed')


# TIMES

@app.route('/times')
def times():

    times = Time.query.all()

    return render_template(
        'times.html',
        times=times
    )


# CRIAR TIME

@app.route('/criar-time',
           methods=['GET', 'POST'])
@login_required
def criar_time():

    if request.method == 'POST':

        time = Time(

            nome=request.form['nome'],

            esporte=request.form['esporte']

        )

        db.session.add(time)

        db.session.commit()

        return redirect('/times')

    return render_template(
        'criar_time.html'
    )


# EDITAR TIME

@app.route('/editar-time/<int:id>',
           methods=['GET', 'POST'])
@login_required
def editar_time(id):

    time = Time.query.get_or_404(id)

    if request.method == 'POST':

        time.nome = request.form['nome']

        time.esporte = request.form['esporte']

        db.session.commit()

        return redirect('/times')

    return render_template(
        'editar_time.html',
        time=time
    )


# EXCLUIR TIME

@app.route('/excluir-time/<int:id>')
@login_required
def excluir_time(id):

    time = Time.query.get_or_404(id)

    db.session.delete(time)

    db.session.commit()

    return redirect('/times')


# TORNEIOS

@app.route('/torneios')
def torneios():

    torneios = Torneio.query.all()

    return render_template(
        'torneios.html',
        torneios=torneios
    )


# CRIAR TORNEIO

@app.route('/criar-torneio',
           methods=['GET', 'POST'])
@login_required
def criar_torneio():

    if request.method == 'POST':

        torneio = Torneio(

            nome=request.form['nome'],

            modalidade=request.form[
                'modalidade'
            ],

            descricao=request.form[
                'descricao'
            ]

        )

        db.session.add(torneio)

        db.session.commit()

        return redirect('/torneios')

    return render_template(
        'criar_torneio.html'
    )


# EDITAR TORNEIO

@app.route('/editar-torneio/<int:id>',
           methods=['GET', 'POST'])
@login_required
def editar_torneio(id):

    torneio = Torneio.query.get_or_404(id)

    if request.method == 'POST':

        torneio.nome = request.form['nome']

        torneio.modalidade = request.form[
            'modalidade'
        ]

        torneio.descricao = request.form[
            'descricao'
        ]

        db.session.commit()

        return redirect('/torneios')

    return render_template(
        'editar_torneio.html',
        torneio=torneio
    )


# EXCLUIR TORNEIO

@app.route('/excluir-torneio/<int:id>')
@login_required
def excluir_torneio(id):

    torneio = Torneio.query.get_or_404(id)

    db.session.delete(torneio)

    db.session.commit()

    return redirect('/torneios')


# PERFIL

@app.route('/perfil')
@login_required
def perfil():

    posts = Post.query.filter_by(
        usuario_id=current_user.id
    ).all()

    return render_template(
        'perfil.html',
        posts=posts
    )