from datetime import datetime

from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Lista fixa de esportes usada em todo o site (chat, perfil, torneios, reels)
ESPORTES = [
    'Futebol', 'Futsal', 'Vôlei', 'ping-pong',
    'Basquete', 'Luta', 'Corrida', 'Outros',
]


class Usuario(UserMixin, db.Model):
    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)

    idade = db.Column(db.Integer)
    bio = db.Column(db.String(200))
    esportes = db.Column(db.String(200), default='')  # esportes separados por vírgula

    criado_em = db.Column(db.DateTime, default=datetime.utcnow)

    def lista_esportes(self):
        return [e for e in (self.esportes or '').split(',') if e]

    def iniciais(self):
        partes = self.nome.strip().split()
        if len(partes) >= 2:
            return (partes[0][0] + partes[-1][0]).upper()
        return self.nome[:2].upper()


class Mensagem(db.Model):
    """Post no Chat/Mural: alguém marcando uma prática, amistoso etc."""
    __tablename__ = 'mensagens'

    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.String(500), nullable=False)
    esporte = db.Column(db.String(30))
    local = db.Column(db.String(120))
    data_sugerida = db.Column(db.String(40))  # texto livre: "sábado 9h", "23/09 às 19h"...

    autor_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    autor = db.relationship('Usuario', foreign_keys=[autor_id])

    criado_em = db.Column(db.DateTime, default=datetime.utcnow)


class Torneio(db.Model):
    __tablename__ = 'torneios'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    esporte = db.Column(db.String(30), nullable=False)
    data = db.Column(db.String(40))
    local = db.Column(db.String(120))
    descricao = db.Column(db.String(400))

    criador_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    criador = db.relationship('Usuario', foreign_keys=[criador_id])

    criado_em = db.Column(db.DateTime, default=datetime.utcnow)


class Resultado(db.Model):
    """Post no Reels: resultado de um jogo/amistoso ou de um torneio que já aconteceu."""
    __tablename__ = 'resultados'

    id = db.Column(db.Integer, primary_key=True)
    esporte = db.Column(db.String(30), nullable=False)
    participantes = db.Column(db.String(150), nullable=False)  # ex: "Turma A vs Turma B"
    placar = db.Column(db.String(60))  # ex: "3 x 1", texto livre
    data = db.Column(db.String(40))
    observacao = db.Column(db.String(300))

    torneio_id = db.Column(db.Integer, db.ForeignKey('torneios.id'))
    torneio = db.relationship('Torneio', foreign_keys=[torneio_id])

    autor_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    autor = db.relationship('Usuario', foreign_keys=[autor_id])

    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
