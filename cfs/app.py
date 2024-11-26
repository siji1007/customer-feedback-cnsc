'''
    TODO:
    1. Error Handlers
    2. Filtration
    3. Survey Submission
    4. Computation
'''

from flask import Flask, render_template, request, flash, redirect, jsonify, session
from bson.objectid import ObjectId
from flask_cors import CORS
import server, json
import os, time, random, re, nltk
from hashlib import sha256
from collections import Counter
from collections import defaultdict
from bertopic import BERTopic
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
import numpy as np
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sentence_transformers import SentenceTransformer, util
from datetime import datetime, timezone, timedelta
from flask_mail import Mail, Message

app = Flask(__name__)

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('punkt_tab')

english_stopwords = set(stopwords.words('english'))
tagalog_stopwords = set([
    'ang', 'sa', 'ng', 'at', 'para', 'na', 'ito', 'ay', 'mga', 'kaysa', 'upang', 'na', 'dahil', 'kapag'
])

combined_stopwords = english_stopwords.union(tagalog_stopwords)
model = SentenceTransformer('distilbert-base-nli-stsb-mean-tokens')

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

def remove_repeated_words(text):
    words = text.split()
    unique_words = list(dict.fromkeys(words))
    return ' '.join(unique_words)

def remove_stopwords(text, stopwords):
    tokens = word_tokenize(text.lower())
    filtered_tokens = [word for word in tokens if word not in stopwords]
    return ' '.join(filtered_tokens)

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




app.config['SECRET_KEY'] = os.urandom(24).hex()  
app.config['SESSION_TYPE'] = 'mongodb'  
app.config['SESSION_MONGODB_COLLECTION'] = server.session_collection  
app.config['SESSION_PERMANENT'] = True  
app.config['SESSION_USE_SIGNER'] = True  


CORS(app, supports_credentials=True, origins=["*"])


import uuid

@app.route('/verify_admin', methods=['POST'])
def login():
    admin_data = request.get_json()
    userName = admin_data['admin_username']
    passWord = admin_data['admin_password']
    

    user = server.user_collection.find_one({'Username': userName, 'Password': passWord, 'type': 'admin'})
    
    if user:
    
        session_id = str(uuid.uuid4()) 
        session['admin'] = user['Username']  
        session['session_id'] = session_id  
        session.modified = True  

        
        server.session_collection.insert_one({
            '_id': session_id,  
            'admin': user['Username'],  
            'session_data': dict(session)  
        })

        return jsonify(message="Access Granted"), 200
    else:
        return jsonify(message="Invalid Credentials"), 401


@app.route('/check_session', methods=['GET'])
def check_session():
    if 'admin' in session:
       
        session_id = session.get('session_id') 
        
        if session_id:
        
            session_data = server.session_collection.find_one({'_id': session_id})
            
            if session_data:
                return jsonify(message="Session is active", username=session['admin']), 200
    return jsonify(message="No active session"), 401


@app.route('/logout', methods=['POST'])
def logout():
    session_id = session.get('session_id') 

    if session_id:
      
        server.session_collection.delete_one({'_id': session_id})
    
    session.clear()  
    
    return jsonify(message="Logged out successfully"), 200


# This is temporary account 
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  
app.config['MAIL_PORT'] = 587 
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'smartcook23@gmail.com'  
app.config['MAIL_PASSWORD'] = 'asflajdmsabuomwh'  
app.config['MAIL_DEFAULT_SENDER'] = 'smartcook23@gmail.com'

mail = Mail(app)

import string
def generate_otp():
    otp = ''.join(random.choices(string.digits, k=4)) 
    return otp



@app.route('/fetch_email', methods=['POST'])
def fetch_email():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    # Check if the email exists in the database
    user = server.user_collection.find_one({"email": email})
    
    if user:
        otp = generate_otp()
        expiry_time = datetime.now(timezone.utc) + timedelta(minutes=10)  

        server.user_collection.update_one(
            {"email": email},
            {"$set": {"otp": otp, "otp_expiry": expiry_time}}
        )

        print(f"Generated OTP: {otp}, Expiry Time: {expiry_time}")  

        try:
            msg = Message(
                subject=f"Your OTP Code {otp}",
                recipients=[email],
                body=f"Your OTP code is: {otp}. It will expire in 10 minutes. If you did not request this OTP, please disregard it. "
            )
            mail.send(msg)

 
            return jsonify({"success": True, "message": "OTP sent successfully", "otp": otp}), 200
        except Exception as e:
            return jsonify({"success": False, "message": "Failed to send OTP", "error": str(e)}), 500
    else:
        return jsonify({"success": False, "message": "Email not found"}), 404




@app.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    otp = data.get('otp')
    new_password = data.get('new_password')

    if not email or not otp or not new_password:
        return jsonify({"success": False, "message": "Email, OTP, and new password are required"}), 400


    user = server.user_collection.find_one({"email": email})

    if not user:
        return jsonify({"success": False, "message": "Invalid email"}), 404

    print(f"Stored OTP: {user.get('otp')}, Provided OTP: {otp}")  

    if user.get('otp') != otp:
        return jsonify({"success": False, "message": "Invalid OTP"}), 401

    # Ensure the otp_expiry is timezone-aware
    otp_expiry = user.get('otp_expiry')
    
    if otp_expiry is not None:
        if otp_expiry.tzinfo is None:
            otp_expiry = otp_expiry.replace(tzinfo=timezone.utc)


    current_time = datetime.now(timezone.utc)


    if current_time > otp_expiry:
        return jsonify({"success": False, "message": "OTP has expired"}), 401


    result = server.user_collection.update_one(
        {"email": email},
        {"$set": {"Password": new_password}, "$unset": {"otp": "", "otp_expiry": ""}}
    )

    if result.modified_count > 0:
        return jsonify({"success": True, "message": "Password reset successfully"}), 200
    else:
        return jsonify({"success": False, "message": "Failed to reset password"}), 500




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
    sid = signUpData['account_id']
    dept = signUpData['student_dept']
    spass = signUpData['student_pass']
    cspass = signUpData['student_cpass']
    if spass == cspass:
        student = {'account_id': sid, 'department': dept, 'password': encryptPass(spass), 'type': 'student'}
        server.user_collection.insert_one(student)
        return "Credentials Accepted"
    else:
        return "Invalid Sign Up Credentials", 401

@app.route('/student-login', methods=['POST'])
def student_login():
    data = request.get_json()
    sid = data['account_id']
    spass = data['password']
    user = server.user_collection.find_one({'account_id': sid, 'password': verifyPass(spass), 'type': 'student'})
    if user:
        return "Access Granted"
    else:
        return "Invalid credentials.", 401
        #return redirect('/')

@app.route('/add-employee', methods=['POST'])
def add_employee():
    employee_creds = request.get_json()
    eid = employee_creds['account_id']
    dept = employee_creds['employee_dept']
    epass = employee_creds['employee_pass']
    cepass = employee_creds['employee_cpass']
    if epass == cepass:
        employee = {'account_id':eid, 'department':dept, 'password':encryptPass(epass), 'type':'employee'}
        server.user_collection.insert_one(employee)
        return "Credentials Accepted"
    else:
        return "Invalid Sign Up Request", 401

@app.route('/employee-login', methods=['POST'])
def employee_login():
    employee_data = request.get_json()
    eid = employee_data['account_id']
    epass = employee_data['employee_pass']
    user = server.user_collection.find_one({'account_id':eid, 'password':verifyPass(epass), 'type':'employee'})
    if user:
        return "Access Granted", 200
    else:
        return "Access Denied", 401

@app.route('/client-login', methods=['POST'])
def login_client():
    client_data = request.get_json()
    client_name = client_data['client_name']
    client_addr = client_data['client_addr']
    client_type = client_data['client_type']
    if(client_name == "" or client_addr == "" or client_type == ""):
        return "Access Denied", 401
    else:
        client = server.client_collection.insert_one({'name': client_name, 'address': client_addr, 'type': client_type})
        return {"message": "Access Granted", "client_id": str(client.inserted_id)}, 200

@app.route('/department')
def get_acad_dept():
    data = server.dept_collection.find()
    data_list = [dept for dept in data]
    departments = [dept["department"] for dept in data_list]
    return jsonify({'departments': departments})


@app.route('/office')
def get_office():
    data = server.office_collection.find()
    offices = [{'id': str(office['_id']), 'name': office['office']} for office in data if office["type"] == "internal"]
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
    data = {'office': office_data["office"], 'description': office_data["description"], 'type': office_data["type"]}
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
    question_data = server.questionnaire_collection.find({"status":{"$exists": True}})
    question_list = [q for q in question_data]
    questions = [q["questions"] for q in question_list if q["office"] in selected_offices["office"] and q["status"] == "active" and q["type"] == selected_offices["type"]]

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
    questionnaire_data = server.questionnaire_collection.find({"status":{"$exists": True}})
    questionnaire_list = [q for q in questionnaire_data]
    questionnaires = [str(q["name"]) for q in questionnaire_list if q["office"] == questionnaire_data_['office'] and q["status"] != "archive" and q["type"] == questionnaire_data_["type"]]
    questionnaire_id = [str(q["_id"]) for q in questionnaire_list if q["office"] == questionnaire_data_['office'] and q["status"] != "archive" and q["type"] == questionnaire_data_["type"]]
    questionnaire_office = [str(q["office"]) for q in questionnaire_list if q["office"] == questionnaire_data_['office'] and q["status"] != "archive" and q["type"] == questionnaire_data_["type"]]
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
    values = [value for r in responses for value in r.values()]
    all_possible_values = set(range(1, 6))
    value_count = Counter(values)
    for value in all_possible_values:
        if value not in value_count:
            value_count[value] = 0
    sorted_keys = sorted(value_count.keys())
    sorted_counts = [value_count[key] for key in sorted_keys]
    return sorted_counts

@app.route("/fetch_specific_dept", methods=['POST'])
def fetchSpecificResponseData():
    res_data = request.get_json()
    response_data = server.answer_collection.find()
    response_list = [r for r in response_data]
    responses = [r["answer"] for r in response_list if r["office"] == res_data["selectedOffice"]]
    values = [value for r in responses for value in r.values()]
    all_possible_values = set(range(1, 6))
    value_count = Counter(values)
    for value in all_possible_values:
        if value not in value_count:
            value_count[value] = 0

    sorted_keys = sorted(value_count.keys())
    sorted_counts = [value_count[key] for key in sorted_keys]
    return sorted_counts

@app.route("/fetch_specific_type", methods=["POST"])
def fetchSpecificType():
    res_data = request.get_json()
    account_data = server.user_collection.find({"account_id": {"$exists": True}, "type": res_data["type"]})
    account_list = [a for a in account_data]
    accounts = [ac["account_id"] for ac in account_list]
    response_data = server.answer_collection.find()
    response_list = [r for r in response_data]
    responses = [r["answer"] for r in response_list if r["account_id"] in accounts]
    values = [value for r in responses for value in r.values()]
    all_possible_values = set(range(1, 6))
    value_count = Counter(values)
    for value in all_possible_values:
        if value not in value_count:
            value_count[value] = 0
    sorted_keys = sorted(value_count.keys())
    sorted_counts = [value_count[key] for key in sorted_keys]
    return sorted_counts

@app.route("/fetch_client_details", methods=["GET", "POST"])
def fetchClientDetails():
    account_data = server.client_collection.find()
    account_list = [a for a in account_data]
    accounts = [str(ac["_id"]) for ac in account_list]
    response_data = server.answer_collection.find()
    response_list = [r for r in response_data]
    responses = [r["answer"] for r in response_list if r["account_id"] in accounts]
    values = [value for r in responses for value in r.values()]
    all_possible_values = set(range(1, 6))
    value_count = Counter(values)
    for value in all_possible_values:
        if value not in value_count:
            value_count[value] = 0
    sorted_keys = sorted(value_count.keys())
    sorted_counts = [value_count[key] for key in sorted_keys]
    return sorted_counts

@app.route("/respondent_data", methods=['GET', 'POST'])
def fetchRespondents():
    type_counter = Counter()
    client_answer_counts = 0
    
    answer_data = server.answer_collection.find()
    answer_list = [al for al in answer_data]
    
    account_data = server.user_collection.find({"account_id": {"$exists": True}})
    account_list = [a for a in account_data]
    
    client_data = server.client_collection.find()
    client_list = [cl for cl in client_data]
    
    # Create a set of account IDs for clients
    client_ids = {str(cl["_id"]) for cl in client_list}
    
    account_dict = {a["account_id"]: a["type"] for a in account_list}
    all_possible_types = ["student", "employee"]

    for al in answer_list:
        account_id = al.get("account_id")
        if account_id:
            account_type = account_dict.get(account_id, "Unknown")
            if account_type in all_possible_types:
                type_counter[account_type] += 1
            
            # Count answers from clients that are in the client_list
            if account_id in client_ids:
                client_answer_counts += 1

    response_array = [
        type_counter["student"], 
        type_counter["employee"],
        client_answer_counts 
    ]

    return jsonify(response_array)

@app.route("/get_feedback_count", methods=["GET"])
def fetchFeedbackCount():
    count = server.answer_collection.count_documents({})
    return jsonify(count)

@app.route("/fetchSpecificOffice", methods=["POST"])
def fetchSpecificFeedbackCount():
    specific_office = request.get_json()
    count = server.answer_collection.count_documents({"office": specific_office["office"]})
    return jsonify(count)

@app.route("/fetchCommentSummary", methods=["GET", "POST"])
def summarizeComments():
    result = []
    comment_data = server.answer_collection.find()
    comment_list = [cl for cl in comment_data]
    if request.method == "POST":
        request_data = request.get_json()
        comments = [c["comment"] for c in comment_list if c["office"] == request_data["office"]]
    else:
        comments = [c["comment"] for c in comment_list]
    vectorizer = CountVectorizer(stop_words='english', max_features=1000)
    X = vectorizer.fit_transform(comments)
    lda_model = LatentDirichletAllocation(n_components=min(len(comments), 5), random_state=42)
    lda_model.fit(X)
    feature_names = vectorizer.get_feature_names_out()
    for topic_idx, topic in enumerate(lda_model.components_):
        result = [feature_names[i] for i in topic.argsort()[:-11:-1]]

    filtered_result = [remove_stopwords(doc, combined_stopwords) for doc in list(set(result))]

    final_result = ""
    for fs in filtered_result:
        final_result += fs + " "

    return jsonify(final_result)

@app.route("/fetchQuestionnaireStatus", methods=["POST"])
def fetchQStats():
    request_data = request.get_json()
    questionnaire_data = server.questionnaire_collection.find({"status": {"$exists": True}})
    questionnaire_list = [qd for qd in questionnaire_data]
    status = [ql["status"] for ql in questionnaire_list if ql["office"] == request_data["office"]]
    return jsonify(status)

@app.route("/updateQStatus", methods=["POST"])
def updateQStats():
    request_data = request.get_json()
    target_data = server.questionnaire_collection.update_one({'_id': ObjectId(request_data["qid"])}, {'$set': {'status': request_data["status"]}})
    return "Question Status Updated Successfully", 200

@app.route("/getArchive", methods=["POST"])
def getArchives():
    request_data = request.get_json()
    archive_data = server.questionnaire_collection.find({"status": {"$exists": True}})
    archive_list = [ad for ad in archive_data]
    archive_id = [str(al["_id"]) for al in archive_list if al["office"] == request_data["office"] and al["status"] == "archive"]
    archive_name = [str(al["name"]) for al in archive_list if al["office"] == request_data["office"] and al["status"] == "archive"]
    return {"aid": archive_id, "aname": archive_name}

@app.route("/recoverArchive", methods=["POST"])
def recoverQuestionnaire():
    request_data = request.get_json()
    target_data = server.questionnaire_collection.update_one({'_id': ObjectId(request_data["selectedId"])}, {'$set': {'status': "hidden"}})
    return "Question had been restored successfully", 200

@app.route("/update_acad_year", methods=["POST"])
def updateAcadYear():
    config_data = request.get_json()
    server.settings_collection.update_one({'_id': ObjectId('669ebc9fbe9cfcf910ab30c1')}, {'$set': {'current_acadYear': config_data["uay"]}})
    return "Academic Year had been updated successfully", 200

@app.route("/update_semester", methods=["POST"])
def updateSem():
    config_data = request.get_json()
    server.settings_collection.update_one({'_id': ObjectId('669ebc9fbe9cfcf910ab30c1')}, {'$set': {'current_semester': config_data["semester"]}})
    return "Semester had been updated successfully", 200

@app.route("/get_validity")
def fetchValidity():
    config_data = server.settings_collection.find()   
    data_list = [config for config in config_data]
    cay = [config["current_acadYear"] for config in data_list]
    cs = [config["current_semester"] for config in data_list]
    return jsonify({'acadYear': cay, 'semester': cs})

@app.route("/fetchTopInsights", methods=["GET", "POST"])
def fetchTopInsights():
    top10 = []
    insight_data = server.answer_collection.find()
    insight_list = [insights for insights in insight_data]
    if request.method == "POST":
        request_data = request.get_json()
        insights = [ins["comment"] for ins in insight_list if ins["office"] == request_data["office"]]
    else:
        insights = [ins["comment"] for ins in insight_list]

    embeddings = model.encode(insights, convert_to_tensor=True)
    repetition_count = defaultdict(int)
    for i in range(len(insights)):
        for j in range(i + 1, len(insights)):
            similarity = util.pytorch_cos_sim(embeddings[i], embeddings[j])
            if similarity > 0.5:
                repetition_count[insights[i]] += 1
                repetition_count[insights[j]] += 1
        
    sorted_comments = sorted(repetition_count.items(), key=lambda x: x[1], reverse=True)
    return jsonify({"sc": sorted_comments})

@app.route("/fetchWordCloud", methods=["GET", "POST"])
def fetchWordCloud():
    insight_data = server.answer_collection.find()
    insight_list = [insight for insight in insight_data]
    
    if request.method == "POST":
        request_data = request.get_json()
        print(request_data)
        office_filter = request_data["office"]
        insights = [ins["comment"] for ins in insight_list if ins["office"] == office_filter and ins["semester"] == request_data["semester"] and ins["academic_year"] == request_data["ay"]]
    else:
        insights = [ins["comment"] for ins in insight_list]
    
    if not insights:
        return jsonify([])
    
    # Step 1: Create a CountVectorizer to process the text data (filtering stopwords)
    vectorizer = CountVectorizer(stop_words='english', max_features=1000)
    X = vectorizer.fit_transform(insights)
    
    # Step 2: Fit an LDA model to the document-term matrix
    lda_model = LatentDirichletAllocation(n_components=min(len(insights), 5), random_state=42)
    lda_model.fit(X)
    
    # Step 3: Extract words for each topic (the top words in each topic)
    feature_names = vectorizer.get_feature_names_out()
    topics = []
    for topic_idx, topic in enumerate(lda_model.components_):
        topic_words = [feature_names[i] for i in topic.argsort()[:-11:-1]]  # Top 10 words for the topic
        topics.append(topic_words)

    # Step 4: Flatten the list of topics into a single list of words and count their occurrences
    all_words = [word for topic in topics for word in topic]
    repetition_count = defaultdict(int)

    for word in all_words:
        repetition_count[word] += 1
    
    # Step 5: Prepare the word cloud data in the format {text: "word", value: frequency}
    word_cloud_data = [{"text": word, "value": count} for word, count in repetition_count.items()]
    
    # Step 6: Sort the word cloud data by frequency (value) in descending order
    sorted_word_cloud_data = sorted(word_cloud_data, key=lambda x: x['value'], reverse=True)
    
    return jsonify(sorted_word_cloud_data)

@app.route("/deleteOffice", methods=["POST"])
def deleteOffice():
    request_data = request.get_json()
    server.office_collection.delete_one({'office': request_data["office"]})
    return "Office had been deleted successfully", 200

@app.route("/deleteDept", methods=["POST"])
def deleteDept():
    request_data = request.get_json()
    server.dept_collection.delete_one({'department': request_data["department"]})
    return "Department had been deleted successfully", 200

@app.route("/fetch_users", methods=["POST"])
def fetchUsers():
    request_data = request.get_json()
    labels = []
    user_count = []
    user_data = server.user_collection.find({"account_id": {"$exists": True}, "department": {"$exists": True}})
    user_list = [sd for sd in user_data]
    user_count_by_department = {}
    for user in user_list:
        if user["type"] == request_data["type"]:
            dept = user["department"]
            if dept not in user_count_by_department:
                user_count_by_department[dept] = 0
            user_count_by_department[dept] += 1

    user_result = user_count_by_department

    for keys, values in user_result.items():
        labels.append(keys)
        user_count.append(values)

    return jsonify({"labels": labels, "user_counts": user_count})


@app.route("/fetch_clients", methods=["GET","POST"])
def fetchClients():
    labels = []
    client_count = []
    client_data = server.client_collection.find()
    client_list = [sd for sd in client_data]
    client_count_by_department = {}
    for client in client_list:
        ctype = client["type"]
        if ctype not in client_count_by_department:
            client_count_by_department[ctype] = 0
        client_count_by_department[ctype] += 1

    client_result = client_count_by_department

    for keys, values in client_result.items():
        labels.append(keys)
        client_count.append(values)

    return jsonify({"labels": labels, "client_counts": client_count})

@app.route("/get_event", methods=["POST"])
def getEvent():
    request_data = request.get_json()
    data = server.questionnaire_collection.find()
    events = [{'id': str(event['_id']), 'name': event['name']} for event in data if event["office"] == request_data["client_type"].capitalize()]
    return jsonify({'events': events})


if __name__ == '__main__':
    app.run(host="0.0.0.0",port="8082")
    

