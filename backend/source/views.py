from flask import Blueprint, render_template, request, flash, jsonify,redirect, url_for,send_file,send_from_directory
from flask_login import login_required, current_user
from .models import User, Message, Contact, Unknown
from . import db
import json
from werkzeug.utils import secure_filename
import os
import hashlib
from flask_jwt_extended import jwt_required, get_jwt_identity



views = Blueprint('views', __name__)

@views.route('/uploads/<filename>')
def download_file(filename):
    return send_from_directory('static/uploads', filename)

@views.route('/contacts', methods=['GET'])
@jwt_required()
def get_contacts():
    user = get_jwt_identity()
    user_id = user['id']
    contacts = Contact.query.filter_by(user_id=user_id).all()
    unknowns = Unknown.query.filter_by(user_id=user_id).all()
    print(contacts)
    print(unknowns)
    contacts_list = []

    # Add known contacts
    for contact in contacts:
        contact_user = User.query.get(contact.contact_id)
        if contact_user:
            contacts_list.append({
                'id': contact.id,
                'contact_id': contact.contact_id,
                'name': contact_user.name,
                'email': contact_user.email,
                'phone': contact_user.phone,
                'category': contact.category,
                'added_by': 'known',  # Mark as 'known'
                'pic': contact_user.profilepic  # Assume this is just a filename
            })

    # Add unknown contacts
    for unknown in unknowns:
        if unknown.user_id == user_id:
            contacts_list.append({
                'id': unknown.id,
                'contact_id': unknown.id,
                'name': unknown.name,
                'email': unknown.email,
                'phone': unknown.phone,
                'category': None,
                'added_by': 'unknown',  # Mark as 'unknown'
                'pic': 'default.jpg'  # Provide a default image
            })

    return jsonify(contacts_list)


@views.route('/contacts', methods=['POST'])
@jwt_required()
def add_contact():
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity['id']  # Assuming user_id is stored in the JWT payload
    
    data = request.get_json()
    email = data.get('email')
    phone = data.get('phone')
    category = data.get('category')

    if not email and not phone:
        return jsonify({"error": "Email or phone is required"}), 400

    contact_user = None

    # Check if the contact is a registered user
    if email:
        contact_user = User.query.filter_by(email=email).first()
    if not contact_user and phone:
        contact_user = User.query.filter_by(phone=phone).first()
    
    if not contact_user:
        unknown_contact = Unknown(
            user_id=user_id, 
            name=data.get('name'),  # Make sure to include name in your request data
            email=email,
            phone=phone
            )
        db.session.add(unknown_contact)
        db.session.commit()
        contact_id = unknown_contact.id
    else:
        contact_id = contact_user.id
        # Create a new contact entry
        new_contact = Contact(
            user_id=user_id, 
            contact_id=contact_id,
            category=category, 
        )
        db.session.add(new_contact)
        db.session.commit()
    
    return jsonify({"message": "Contact added successfully"}), 201


@views.route('/contacts/<int:contact_id>', methods=['DELETE'])
@jwt_required()
def delete_contact(contact_id):
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity['id']  # Assuming user_id is stored in the JWT payload

    # Find the contact
    contact = Contact.query.filter_by(user_id=user_id, id=contact_id).first()

    if contact:
        db.session.delete(contact)
        db.session.commit()
    if not contact:
        unknown=Unknown.query.filter_by(user_id=user_id, id=contact_id).first()
        if unknown:
            db.session.delete(unknown)
            db.session.commit()
        else:
            return jsonify({"error": "Contact not found"}), 404
    return jsonify({"message": "Contact deleted successfully"}), 200

@views.route('/contacts/<int:contact_id>', methods=['PUT'])
@jwt_required()
def update_contact(contact_id):
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity['id']  # Assuming user_id is stored in the JWT payload
    
    data = request.get_json()
    new_name = data.get('name')
    
    if not new_name:
        return jsonify({"error": "Name is required"}), 400

    # Find the contact
    contact = Contact.query.filter_by(user_id=user_id, id=contact_id).first()

    if not contact:
        return jsonify({"error": "Contact not found"}), 404

    contact_user = User.query.get(contact.contact_id)

    if not contact_user:
        return jsonify({"error": "User not found"}), 404

    contact_user.name = new_name
    db.session.commit()
    
    return jsonify({"message": "Contact updated successfully"}), 200

