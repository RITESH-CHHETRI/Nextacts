from flask import Blueprint, render_template, request, flash, abort, current_app, redirect,url_for,jsonify
from flask_login import login_required, current_user
from .models import User, Message
from . import db
from sqlalchemy import exists, case
import random, string
from datetime import datetime
from . import socketio
import pusher
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity



pusher = pusher_client = pusher.Pusher(
  app_id=app_id,
  key=key,
  secret=secret,
  cluster=cluster,
  ssl=True
)

chat = Blueprint('chat', __name__)

def uidgenerator(receiver, sender):
    uid = [receiver, sender]
    uid = sorted(uid)
    newuid = uid[0] + uid[1]
    newuid = newuid.replace(" ", "")
    return newuid

@chat.route('/chat', methods=['POST'])
@jwt_required()
def sessions():
    current_user_identity = get_jwt_identity()
    current_user = User.query.get(current_user_identity['id'])
    data = request.json
    receiver_name = data.get('chat')
    uid = uidgenerator(current_user.name, receiver_name)
    
    messages = Message.query.filter_by(uid=uid).all()
    for msg in messages:
        if msg.sender != current_user.name:
            msg.read = 'true'
    
    db.session.commit()
    
    return jsonify({
        'uid': uid,  # Include the uid in the response
        'messages': [{'sender': msg.sender, 'message': msg.message, 'timestamp': msg.posted} for msg in messages]
    })

@chat.route('/message', methods=['POST'])
@jwt_required()
def message():
    try:
        current_user_identity = get_jwt_identity()
        current_user = User.query.get(current_user_identity['id'])
        data = request.json
        message_text = data['message']
        receiver_name = data['user_id']
        
        uid = uidgenerator(current_user.name, receiver_name)
        now = datetime.now()
        timestamp = now.strftime("%d-%m-%Y %I:%M %p")
        
        save_message = Message(uid=uid, message=message_text, sender=current_user.name, posted=timestamp)
        db.session.add(save_message)
        db.session.commit()
        
        pusher_client.trigger(f'private-user_{uid}', 'new_message', {
            'sender': current_user.name,
            'message': message_text,
            'timestamp': timestamp
        })
        
        return jsonify({'status': 'success', 'uid': uid})
    except Exception as e:
        return jsonify({'status': 'failure', 'error': str(e)})

@chat.route('/pusher/auth', methods=['POST'])
@jwt_required()
def pusher_authentication():
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity['id']
    
    auth = pusher_client.authenticate(
        channel=request.form['channel_name'],
        socket_id=request.form['socket_id'],
        custom_data={'user_id': user_id}
    )
    return jsonify(auth)



@chat.route('/delmsg', methods=['POST'])
@jwt_required()
def delmsg():
    try:
        current_user_identity = get_jwt_identity()
        current_user = User.query.get(current_user_identity['id'])
        msg_id = request.json.get('msgdel')
        message = Message.query.get(msg_id)
        if message:
            if message.sender == current_user.name:
                db.session.delete(message)
                db.session.commit()
                return jsonify({'status': 'success'})
            else:
                return jsonify({'status': 'failure', 'error': 'You can only delete your own messages'})
        return jsonify({'status': 'failure', 'error': 'Message not found'})
    except Exception as e:
        return jsonify({'status': 'failure', 'error': str(e)})


import uuid
import twilio.jwt.access_token
import twilio.jwt.access_token.grants
import twilio.rest


twilio_client = twilio.rest.Client(TWILIO_KEY, TWILIO_SECRET, TWILIO_SID)

def find_or_create_room(room_name):
    try:
        twilio_client.video.rooms(room_name).fetch()
    except twilio.base.exceptions.TwilioRestException as e:
        if e.status == 404:
            twilio_client.video.rooms.create(unique_name=room_name, type="go")
        else:
            raise

def get_access_token(room_name):
    access_token = twilio.jwt.access_token.AccessToken(
        TWILIO_SID, TWILIO_KEY, TWILIO_SECRET, identity=str(uuid.uuid4())
    )
    video_grant = twilio.jwt.access_token.grants.VideoGrant(room=room_name)
    access_token.add_grant(video_grant)
    return access_token

@chat.route('/join-room', methods=['POST'])
@jwt_required()
def join_room():
    current_user_identity = get_jwt_identity()
    receiver = request.json.get("video")
    sender = User.query.get(current_user_identity['id']).name
    room_name = uidgenerator(sender, receiver)

    find_or_create_room(room_name)
    access_token = get_access_token(room_name)
    token = access_token.to_jwt()

    return jsonify({
        "room_name": room_name,
        "token": token  # No need to decode
    })

