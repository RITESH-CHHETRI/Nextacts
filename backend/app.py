from src import create_app
from flask_socketio import SocketIO
from flask_moment import Moment
from flask import render_template
from flask_cors import CORS
import os

socket,app = create_app()
CORS(app) 


if __name__ == '__main__':
    app.run(threaded=True,port=os.getenv("PORT"), host='0.0.0.0')
    #socket.run(app,debug=True)