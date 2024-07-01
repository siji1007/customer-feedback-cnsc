from flask import Flask, render_template, request, flash, redirect
import server
import os

app = Flask(__name__)

@app.route('/')
def flask_mongodb_atlas():
    try:
        data = server.dept_collection.find()
        type_data = server.client_type_collection.find()
        data_list = [d for d in data]
        type_list = [t for t in type_data]
        options = [d["department"] for d in data_list if d["type"] == "service"]
        optionUnit = [d["department"] for d in data_list if d["type"] == "academic"]
        optionAll = [d["department"] for d in data_list]
        clientTypes = [t["types"] for t in type_list]
        return render_template('index.html', options=options, optionUnit=optionUnit, optionAll=optionAll, clientTypes = clientTypes)
    except:
        return render_template('index.html')
    
@app.route('/insert', methods=['POST'])
def insert():
    fullname = request.form.get('fullname')
    username = request.form.get('username')
    password = request.form.get('password')
    data = {'Full Name': fullname, 'Username':username, 'Password': password, 'Type': 'admin'}
    server.user_collection.insert_one(data)
    return redirect('/')

@app.route('/insert-dept', methods=['POST'])
def insert_dept():
    fullname = request.form.get('fullname')
    username = request.form.get('username')
    password = request.form.get('password')
    department = request.form.get('department')
    data = {'Full Name': fullname, 'Username':username, 'Password': password, 'Department': department, 'Type': 'office head'}
    server.user_collection.insert_one(data)
    return redirect('/')
    
@app.route('/show', methods=['POST'])
def show():
    data = list(server.user_collection.find())
    return render_template('show.html', data=data)
    
@app.route('/delete_all', methods=['POST'])
def delete_all():
    server.user_collection.delete_many({})
    return redirect('/')

@app.route('/login', methods=['POST'])
def login():
    userName = request.form.get('username')
    passWord = request.form.get('password')
    user = server.user_collection.find_one({'Username': userName, 'Password': passWord, 'Type': 'admin'})
    if user:
        return show()
    else:
        return redirect('/')

@app.route('/add-dept', methods=['POST'])
def add_dept():
    deptName = request.form.get('dept-name')
    deptType = request.form.get('dept-type')
    data = {'department': deptName, 'type': deptType}
    server.dept_collection.insert_one(data)
    return redirect('/')

@app.route('/verify_oh', methods=['POST'])
def verify_oh():
    dept = request.form.get('department')
    pWord = request.form.get('ohpass')
    user = server.user_collection.find_one({'Department': dept, 'Password': pWord})
    if user:
        return "Access Granted"
    else:
        return redirect('/')

@app.route('/add-student', methods=['POST'])
def add_student():
    sid = request.form.get('student_id')
    dept = request.form.get('student_dept')
    spass = request.form.get('student_pass')
    cspass = request.form.get('student_cpass')
    if spass == cspass:
        student = {'student_id': sid, 'department': dept, 'password': spass, 'type': 'student'}
        server.user_collection.insert_one(student)
        return redirect('/')
    else:
        return redirect('/')
    
@app.route('/student-login', methods=['POST'])
def student_login():
    sid = request.form.get('student-signin')
    spass = request.form.get('student-pass')
    user = server.user_collection.find_one({'student_id': sid, 'password': spass, 'type': 'student'})
    if user:
        return "Access Granted"
    else:
        return redirect('/')
    
@app.route('/add-employee', methods=['POST'])
def add_employee():
    eid = request.form.get('employee_id')
    dept = request.form.get('employee_dept')
    epass = request.form.get('employee_pass')
    cepass = request.form.get('employee_cpass')
    if epass == cepass:
        employee = {'employee_id':eid, 'department':dept, 'password':epass, 'type':'employee'}
        server.user_collection.insert_one(employee)
        return redirect('/')
    else:
        return redirect('/')
    
@app.route('/employee-login', methods=['POST'])
def employee_login():
    eid = request.form.get('employee-signin')
    epass = request.form.get('employee-pass')
    user = server.user_collection.find_one({'employee_id':eid, 'password':epass, 'type':'employee'})
    if user:
        return "Access Granted"
    else:
        return redirect('/')

@app.route('/add-type', methods=['POST'])
def add_type():
    type_name = request.form.get('type_input')
    server.client_type_collection.insert_one({'types':type_name})
    return redirect('/')

@app.route('/client_login', methods=['POST'])
def login_client():
    client_name = request.form.get('client_name')
    client_addr = request.form.get('client_addr')
    client_type = request.form.get('client_type')
    client = server.user_collection.insert_one({'name': client_name, 'address': client_addr, 'type': client_type})
    return "Access Granted"

    
@app.route('/register', methods=['POST'])
def register():
    pass

if __name__ == '__main__':
    app.run(port=input("Port: "))
