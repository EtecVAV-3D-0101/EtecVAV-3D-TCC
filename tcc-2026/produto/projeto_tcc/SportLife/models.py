from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class Usuario(UserMixin, db.Model):

    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True)

    nome = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(100), unique=True, nullable=False)

    senha = db.Column(db.String(255), nullable=False)

    foto = db.Column(db.String(255), default='user.png')


class Post(db.Model):

    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)

    titulo = db.Column(db.String(150))

    descricao = db.Column(db.Text)

    imagem = db.Column(db.String(255))

    usuario_id = db.Column(
        db.Integer,
        db.ForeignKey('usuarios.id')
    )


class Time(db.Model):

    __tablename__ = 'times'

    id = db.Column(db.Integer, primary_key=True)

    nome = db.Column(db.String(100))

    esporte = db.Column(db.String(100))

    imagem = db.Column(db.String(255))


class Torneio(db.Model):

    __tablename__ = 'torneios'

    id = db.Column(db.Integer, primary_key=True)

    nome = db.Column(db.String(100))

    modalidade = db.Column(db.String(100))

    descricao = db.Column(db.Text)

    imagem = db.Column(db.String(255))