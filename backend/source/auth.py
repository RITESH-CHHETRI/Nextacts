from flask import Blueprint, request, jsonify
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from . import db, mail
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from uuid import uuid4
from flask_mail import Message
from flask_cors import CORS

auth = Blueprint('auth', __name__)
CORS(auth)  # Enable CORS for the auth blueprint

baselink = "localhost:3000/otpverify"  # Changed to React frontend URL

def otpgenerator(name, mailid):
    unique = False
    while not unique:
        otp = str(uuid4())[:4]
        user = User.query.filter_by(otp=otp).first()
        unique = user is None

    msg = Message('Nextacts OTP VERIFICATION', sender=("Nextacts", 'roguealex444@gmail.com'), recipients=[mailid])
    msg.body = f"OTP Verification for {name}\nYour otp is {otp}\nVerify it here: {baselink}\nThank you for using Nextacts\nPlease do not respond if you have not requested this email"
    mail.send(msg)
    return otp

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if user:
        if check_password_hash(user.password, password):
            if user.otp != "none":
                return jsonify({'error': 'Please verify your email first'}), 400
            access_token = create_access_token(identity={'id': user.id, 'email': user.email})
            user.logined = "true"
            db.session.commit()
            return jsonify({'message': 'Logged in successfully!', 'access_token': access_token,'username':user.name}), 200
        else:
            return jsonify({'error': 'Wrong password'}), 400
    else:
        return jsonify({'error': 'No user found'}), 404


@auth.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user['id']).first()
    user.logined = "false"
    return jsonify({'message': 'Logged out successfully!'}), 200

@auth.route('/sign-up', methods=['POST'])
def sign_up():
    data = request.form
    email = data.get('email')
    name = data.get('name')
    phone = data.get('phone')
    profile = request.files['profile']
    password1 = data.get('password1')
    password2 = data.get('password2')

    user = User.query.filter_by(email=email).first()
    pic = name + '.png'

    if user:
        return jsonify({'error': 'Email already exists'}), 400
    elif len(email) < 6:
        return jsonify({'error': 'Email must be greater than 6 characters'}), 400
    elif len(name) < 2:
        return jsonify({'error': 'Name must be greater than 1 character'}), 400
    elif password1 != password2:
        return jsonify({'error': 'Passwords don\'t match'}), 400
    elif len(password1) < 7:
        return jsonify({'error': 'Passwords must be greater than 7 characters'}), 400
    else:
        if profile:
            if profile.content_type not in ['image/jpeg', 'image/png']:
                return jsonify({'error': 'Image should be in png or jpeg format'}), 400
            if profile.content_length > 10000:
                return jsonify({'error': 'Image file should be under 10 MB'}), 400
            pic = secure_filename(profile.filename)
            profile.save('uploads/' + pic)

        new_user = User(email=email, name=name, password=generate_password_hash(
            password1, method='sha256'), websocket_id=uuid4().hex, profilepic=pic, otp=otpgenerator(name, email), phone=phone)
        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity={'id': new_user.id, 'email': new_user.email})
        return jsonify({'message': 'Sign up successful! Please verify your email.', 'access_token': access_token}), 201

@auth.route('/otpverify', methods=['POST'])
def otpverify():
    data = request.get_json()
    otp = data.get('otp')
    user = User.query.filter_by(otp=otp).first()
    if user:
        user.otp = "none"
        db.session.commit()
        return jsonify({'message': 'OTP verified successfully!'}), 200
    else:
        return jsonify({'error': 'Invalid OTP'}), 400
