'''
    TODO:
    1. Error Handlers
    2. Filtration
    3. Survey Submission
    4. Computation
'''


from flask import Flask, render_template, request, flash, redirect, jsonify
from bson.objectid import ObjectId
from flask_cors import CORS
import server, json
import os, time, random
from hashlib import sha256
from collections import Counter

app = Flask(__name__)
CORS(app)

# Non Routing Functions
def showDepts():
    depts = server.dept_collection.find()
    dept_list = [dept for dept in depts]
    departments = [dept["department"] for dept in dept_list]
    return departments


def generate_question_id():
    timestamp = int(time.time())
    random_part = random.randint(1000, 9999)  # Generate random 4-digit number
    return f"Q-{timestamp}-{random_part}"

def encryptPass(password):
    if len(password) < 8:
        return "Invalid Password", 401

    hash = verifyPass(password)
    return hash

def verifyPass(pword):
    hash = sha256(pword.encode('utf-8')).hexdigest()
    return hash

#Routing Functions
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
    return render_template('admin.html', selected_dept="OSSD", departments=showDepts())

@app.route('/add-type', methods=['POST'])
def add_type():
    type_name = request.form.get('type_input')
    server.client_type_collection.insert_one({'types':type_name})
    return redirect('/')

@app.route("/select-dept", methods=['POST'])
def select_department():
    try:
        selected_dept = request.form.get('dept_select')
        return render_template('admin.html', selected_dept=selected_dept, departments=showDepts())
    except:
        return render_template('admin.html')


# JSON-based

@app.route('/verify-admin', methods=['POST'])
def login():
    admin_data=request.get_json();
    userName = admin_data['admin_username']
    passWord = admin_data['admin_password']
    user = server.user_collection.find_one({'Username': userName, 'Password': passWord, 'Type': 'admin'})
    if user:
        return "Access Granted"
    else:
        return "Invalid Credentials", 401

@app.route('/verify_oh', methods=['POST'])
def verify_oh():
    officeHead_data = request.get_json()
    dept = officeHead_data['officeHead_department']
    pWord = officeHead_data['officeHead_password']
    user = server.user_collection.find_one({'Department': dept, 'Password': pWord, 'Type': "office head"})
    if user:
        return "Access Granted"
    else:
        return "Invalid Credentials", 401

@app.route('/add-student', methods=['POST'])
def add_student():
    signUpData = request.get_json()
    sid = signUpData['student_id']
    dept = signUpData['student_dept']
    spass = signUpData['student_pass']
    cspass = signUpData['student_cpass']
    if spass == cspass:
        student = {'student_id': sid, 'department': dept, 'password': encryptPass(spass), 'type': 'student'}
        server.user_collection.insert_one(student)
        return "Credentials Accepted"
    else:
        return "Invalid Sign Up Credentials", 401

@app.route('/student-login', methods=['POST'])
def student_login():
    data = request.get_json()
    sid = data['student_id']
    spass = data['password']
    user = server.user_collection.find_one({'student_id': sid, 'password': verifyPass(spass), 'type': 'student'})
    if user:
        return "Access Granted"
    else:
        return "Invalid credentials.", 401
        #return redirect('/')

@app.route('/add-employee', methods=['POST'])
def add_employee():
    employee_creds = request.get_json()
    eid = employee_creds['employee_id']
    dept = employee_creds['employee_dept']
    epass = employee_creds['employee_pass']
    cepass = employee_creds['employee_cpass']
    if epass == cepass:
        employee = {'employee_id':eid, 'department':dept, 'password':encryptPass(epass), 'type':'employee'}
        server.user_collection.insert_one(employee)
        return "Credentials Accepted"
    else:
        return "Invalid Sign Up Request", 401

@app.route('/employee-login', methods=['POST'])
def employee_login():
    employee_data = request.get_json()
    eid = employee_data['employee_id']
    epass = employee_data['employee_pass']
    user = server.user_collection.find_one({'employee_id':eid, 'password':verifyPass(epass), 'type':'employee'})
    if user:
        return "Access Granted"
    else:
        return "Access Denied", 401

@app.route('/client-login', methods=['POST'])
def login_client():
    client_data = request.get_json()
    client_name = client_data['client_name']
    client_addr = client_data['client_addr']
    client_type = client_data['client_type']
    client = server.user_collection.insert_one({'name': client_name, 'address': client_addr, 'type': client_type})
    return "Access Granted"

@app.route('/all_department')
def get_all_dept():
    data = server.dept_collection.find()
    data_list = [dept for dept in data]
    departments = [dept["department"] for dept in data_list]
    return jsonify({'departments': departments})

@app.route('/department')
def get_acad_dept():
    data = server.dept_collection.find()
    data_list = [dept for dept in data]
    departments = [dept["department"] for dept in data_list]
    return jsonify({'departments': departments})


@app.route('/office')
def get_office():
    data = server.office_collection.find()
    offices = [{'id': str(office['_id']), 'name': office['office']} for office in data]
    return jsonify({'offices': offices})

@app.route('/get_acad_years', methods=['POST', 'GET'])
def get_acad_years():
    years = []
    for year in range(2024, 2031):
        years.append(str(year) + " - " + str(year + 1))

    return years

@app.route("/edit-questionnaire", methods=['POST'])
def edit_questionnaire():
    question_data = request.get_json()
    server.questionnaire_collection.update_one({'_id': ObjectId(question_data["qid"])}, {'$set': {'title': question_data["question"]}})
    return "Questionnaire Edited Successfully.", 200

@app.route('/add-dept', methods=['POST'])
def add_dept():
    dept_data = request.get_json()
    data = {'department': dept_data["department"]}
    server.dept_collection.insert_one(data)
    return "Department added successfully.", 200

@app.route('/add-office', methods=['POST'])
def add_office():
    office_data = request.get_json()
    data = {'office': office_data["office"]}
    server.office_collection.insert_one(data)
    return "Office added successfully.", 200

@app.route('/get-config', methods=['GET'])
def get_config():
    data = server.settings_collection.find()
    data_list = [config for config in data]
    rs = [config["reminder_state"] for config in data_list]
    fbs = [config["feedback_state"] for config in data_list]
    return jsonify({'reminder_state': rs, 'feedback_state': fbs})

@app.route('/set-feedback-conf', methods=['POST'])
def setFeedbackConf():
    config_data = request.get_json();
    server.settings_collection.update_one({'_id': ObjectId('669ebc9fbe9cfcf910ab30c1')}, {'$set': {'feedback_state': config_data["feedback-conf"]}})
    return "Questionnaire Edited Successfully.", 200

@app.route('/set-reminder-conf', methods=['POST'])
def setReminderConf():
    config_data = request.get_json();
    server.settings_collection.update_one({'_id': ObjectId('669ebc9fbe9cfcf910ab30c1')}, {'$set': {'reminder_state': config_data["reminder-conf"]}})
    return "Questionnaire Edited Successfully.", 200

@app.route('/show_questions', methods=['POST'])
def showQuestions():
    selected_offices = request.get_json()
    question_data = server.questionnaire_collection.find()
    question_list = [q for q in question_data]
    questions = [q["questions"] for q in question_list if q["office"] in selected_offices["office"]]
    return questions[0]

@app.route('/submit_answer', methods=["POST"])
def surveySuccess():
    survey_result = request.get_json()
    server.answer_collection.insert_one(survey_result)
    return "Recorded Successfully"

@app.route("/add-questionnaire", methods=['POST'])
def add_questionnaire():
    questionnaire_data = request.get_json()
    questionnaire = server.questionnaire_collection.insert_one(questionnaire_data)
    return "Question Added Successfully"

@app.route('/flash-questionnaire', methods=['POST'])
def showQuestionnaires():
    questionnaire_data_ = request.get_json()
    print(questionnaire_data_)
    questionnaire_data = server.questionnaire_collection.find()
    questionnaire_list = [q for q in questionnaire_data]
    questionnaires = [str(q["name"]) for q in questionnaire_list if q["office"] == questionnaire_data_['office']]
    questionnaire_id = [str(q["_id"]) for q in questionnaire_list if q["office"] == questionnaire_data_['office']]
    questionnaire_office = [str(q["office"]) for q in questionnaire_list if q["office"] == questionnaire_data_['office']]
    return {"qid":questionnaire_id,"name": questionnaires, "office": questionnaire_office}

@app.route("/add-question", methods=['POST'])
def add_question():
    question_data = request.get_json()
    questionnaire_id= question_data["qid"]
    new_question=question_data["question"]
    new_question_data = {
        "q_id": generate_question_id(),
        "question": new_question
    }
    server.questionnaire_collection.update_one({'_id': ObjectId(questionnaire_id)}, {'$push': {'questions': new_question_data}})
    return jsonify({'message': 'Data updated successfully'}), 200

@app.route("/get_questions", methods=['POST'])
def get_questions():
    qid_data = request.get_json()
    question_data = server.questionnaire_collection.find()
    question_list = [q for q in question_data]
    questions = [q["questions"] for q in question_list if q["_id"] == ObjectId(qid_data["qid"])]
    return jsonify(questions[0])

@app.route("/edit-question", methods=['POST'])
def edit_questions():
    questionData = request.get_json()
    server.questionnaire_collection.update_one(
               {'_id': ObjectId(questionData['qid'])},
               {'$set': {'questions.$[elem].question': questionData['question']}},
               array_filters=[{'elem.q_id': questionData['q_id']}]
           )
    return "Questionnaire Edited Successfully.", 200

@app.route("/response_data", methods=['GET'])
def fetchResponseData():
    response_data = server.answer_collection.find()
    response_list = [r for r in response_data]
    responses = [r["answer"] for r in response_list]
    result = [sum(d.get(str(i), 0) for d in responses) for i in range(max(max(map(int, d.keys())) for d in responses) + 1)]
    return result

@app.route("/respondent_data", methods=['GET'])
def fetchRespondentData():
    response_data = server.answer_collection.find()
    response_list = [r for r in response_data]
    respondents = [r["type"] for r in response_list]
    type_count = Counter(respondents)
    result = list(type_count.values())
    return result

if __name__ == '__main__':
    app.run(port="8082")
