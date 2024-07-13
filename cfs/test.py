from flask import Flask, render_template, request, flash, redirect, jsonify
from bson.objectid import ObjectId
from flask_cors import CORS
import server, json
import os, time, random


app = Flask(__name__)
CORS(app)

def showDepts():
    depts = server.dept_collection.find()
    dept_list = [dept for dept in depts]
    departments = [dept["department"] for dept in dept_list]
    return departments

def showQuestionnaires(sd = "OSSD"):
    questionnaire_data = server.questionnaire_collection.find()
    questionnaire_list = [q for q in questionnaire_data]
    questionnaires = [(q["_id"],q["title"]) for q in questionnaire_list if q["department"] == sd]
    return questionnaires

def generate_question_id():
    timestamp = int(time.time())
    random_part = random.randint(1000, 9999)  # Generate random 4-digit number
    return f"Q-{timestamp}-{random_part}"

def showQuestions(qid):
    question_data = server.questionnaire_collection.find({})
    question_list = [q for qd in question_data if qd.get('_id')==qid for q in qd.get('questions')]
    questions = [(q["q_id"], q["question"]) for q in question_list]
    return questions

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

@app.route('/admin')
def showAdmin():
    return render_template('admin.html', selected_dept="OSSD", questionnnaires=showQuestionnaires(), departments=showDepts())

@app.route('/verified-admin', methods=['POST'])
def login():
    userName = request.form.get('username')
    passWord = request.form.get('password')
    user = server.user_collection.find_one({'Username': userName, 'Password': passWord, 'Type': 'admin'})
    if user:
        return render_template('admin.html', departments=showDepts())
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

@app.route('/client-login', methods=['POST'])
def login_client():
    client_name = request.form.get('client_name')
    client_addr = request.form.get('client_addr')
    client_type = request.form.get('client_type')
    client = server.user_collection.insert_one({'name': client_name, 'address': client_addr, 'type': client_type})
    return "Access Granted"

@app.route("/select-dept", methods=['POST'])
def select_department():
    try:
        selected_dept = request.form.get('dept_select')
        return render_template('admin.html', selected_dept=selected_dept, questionnaires=showQuestionnaires(selected_dept), departments=showDepts())
    except:
        return render_template('admin.html')

@app.route("/add-questionnaire", methods=['POST'])
def add_questionnaire():
    questionnaire_title=request.form.get('questionnaire_title')
    department_type=request.form.get('dept')
    questionnaire = server.questionnaire_collection.insert_one({'title': questionnaire_title, 'department': department_type})
    return redirect('/admin')

@app.route("/edit-questionnaire", methods=['POST'])
def edit_questionnaire():
    try:
        qid=request.form.get('qid')
        qtitle=request.form.get('qtitle')
        qdept=request.form.get('qdept')
        return render_template('edit.html', questionnaire_id=qid, department=qdept, title=qtitle, questions=showQuestions(ObjectId(qid)))
    except:
        return render_template('edit.html', questionnaire_id=qid, department=qdept, title=qtitle)

@app.route("/add-question", methods=['POST'])
def add_question():
    questionnaire_id=request.form.get('questionnaire_id')
    new_question=request.form.get('new_question')
    new_question_data = {
        "q_id": generate_question_id(),
        "question": new_question
    }
    server.questionnaire_collection.update_one({'_id': ObjectId(questionnaire_id)}, {'$push': {'questions': new_question_data}})
    return jsonify({'message': 'Data updated successfully'}), 200

@app.route('/register', methods=['POST'])
def register():
    pass

if __name__ == '__main__':
    app.run(port="8082")
