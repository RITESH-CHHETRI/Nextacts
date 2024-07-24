from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func
from datetime import datetime

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(150), unique=True, nullable=False)
    websocket_id = db.Column(db.String, unique=True, index=True)
    name = db.Column(db.String(150), unique=True)
    profilepic = db.Column(db.String(100))
    logined = db.Column(db.String(10), default="true")
    otp = db.Column(db.String(10))
    
    # Define relationships
    contacts = db.relationship('Contact', 
                               foreign_keys='Contact.user_id', 
                               backref='user', 
                               lazy=True)

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    contact_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    added_by = db.Column(db.String(150), nullable=False)  # "phone" or "email"
    category = db.Column(db.String(100))  # Category for the contact
    
    # Define the relationship to refer to the contact user
    contact_user = db.relationship('User', foreign_keys=[contact_id])
    
    db.UniqueConstraint('user_id', 'contact_id', name='unique_contact')

class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(100))
    message = db.Column(db.String(1000))
    posted = db.Column(db.String(50))
    sender = db.Column(db.String(100))
    read = db.Column(db.String(10), default='false')