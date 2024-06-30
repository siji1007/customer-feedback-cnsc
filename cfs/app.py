from flask import Flask, render_template, request, flash
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
    data = {'Full Name': fullname, 'Username':username, 'Password': password, 'Type': 'admin'}
    server.user_collection.insert_one(data)
    return render_template('index.html')

@app.route('/insert-dept', methods=['POST'])
def insert_dept():
   fullname = request.form.get('fullname')
   username = request.form.get('username')
   password = request.form.get('password')
   department = request.form.get('department')
   data = {'Full Name': fullname, 'Username':username, 'Password': password, 'Department': department, 'Type': 'office head'}
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

@app.route('/oh_login', methods=['GET'])
def oh_login():
    data = server.dept_collection.find()
    data_list = [d for d in data]
    options = [d["department"] for d in data_list]
    return render_template('oh_login.html', options=options)

@app.route('/login', methods=['POST'])
def login():
    userName = request.form.get('username')
    passWord = request.form.get('password')
    user = server.user_collection.find_one({'Username': userName, 'Password': passWord, 'Type': 'admin'})
    if user:
      return render_template('show.html')
    else:
      return render_template('login.html')

@app.route('/add-dept', methods=['POST'])
def add_dept():
    deptName = request.form.get('dept-name')
    data = {'department': deptName}
    server.dept_collection.insert_one(data)
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    pass

if __name__ == '__main__':
    app.run(port=input("Port: "))
