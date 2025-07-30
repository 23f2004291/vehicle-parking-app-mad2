from flask import current_app as app
from backend.models import db
from flask_security import SQLAlchemyUserDatastore, hash_password

with app.app_context():
    # Create the database tables
    # db.drop_all()
    db.create_all()

    userdatastore: SQLAlchemyUserDatastore = app.security.datastore

    # Create roles
    userdatastore.find_or_create_role(name='admin', description='Administrator')
    userdatastore.find_or_create_role(name='user', description='Regular User')

    # Admin user
    if not userdatastore.find_user(email='admin@gmail.com'):
        userdatastore.create_user(email='admin@gmail.com', password = hash_password('admin'), roles=['admin'])

    # Test user
    if not userdatastore.find_user(email='user1@gmail.com'):   # fixed email here
        userdatastore.create_user(email='user1@gmail.com', password = hash_password('user1'), roles=['user'])

    db.session.commit()

