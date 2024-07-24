from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
from flask_socketio import SocketIO
from flask_moment import Moment
from flask_mail import Mail

from flask_jwt_extended import JWTManager

db = SQLAlchemy()
DB_NAME = "database.db"
socketio = SocketIO()
jwt = JWTManager()

def create_app():
    global mail
    app = Flask(__name__)
    app.config['SECRET_KEY'] = ''
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USERNAME'] = '@gmail.com'
    app.config['MAIL_PASSWORD'] = ''
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    db.init_app(app)
    jwt.init_app(app)
    moment = Moment(app)
    mail = Mail(app)
    from .auth import auth
    app.register_blueprint(auth, url_prefix='/')
    from .models import User

    create_database(app)

    return socketio, app


def create_database(app):
    if not path.exists('src/' + DB_NAME):
        db.create_all(app=app)
        print('Created Database!')
