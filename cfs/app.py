from flask import Flask, render_template, request
import server
import os

app = Flask(__name__)

@app.route('/')
def flask_mongodb_atlas():
    return render_template('index.html')
    
@app.route('/insert', methods=['POST'])
def insert():
    fullname = request.form.get('fullname')
    username = request.form.get('username')
    password = request.form.get('password')
    data = {'Full Name': fullname, 'Username':username, 'Password': password}
    server.user_collection.insert_one(data)
    return render_template('index.html')
    
@app.route('/show', methods=['POST'])
def show():
    data = list(server.user_collection.find())
    return render_template('show.html', data=data)
    
@app.route('/delete_all', methods=['POST'])
def delete_all():
    server.user_collection.delete_many({})
    return render_template('index.html')

@app.route('/go_login', methods=['GET'])
def go_login():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    userName = request.form.get('username')
    passWord = request.form.get('password')
    
    
if __name__ == '__main__':
    app.run(port=input("Port: "))
