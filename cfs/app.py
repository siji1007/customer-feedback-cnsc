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

app = Flask(__name__)
CORS(app)

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


# JSON-based

@app.route('/verify-admin', methods=['POST'])
def login():
    admin_data=request.get_json()
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
    question_data = server.questionnaire_collection.find({"status":{"$exists": True}})
    question_list = [q for q in question_data]
    questions = [q["questions"] for q in question_list if q["office"] in selected_offices["office"] and q["status"] == "active"]

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
    questionnaire_data = server.questionnaire_collection.find({"status":{"$exists": True}})
    questionnaire_list = [q for q in questionnaire_data]
    questionnaires = [str(q["name"]) for q in questionnaire_list if q["office"] == questionnaire_data_['office'] and q["status"] != "archive"]
    questionnaire_id = [str(q["_id"]) for q in questionnaire_list if q["office"] == questionnaire_data_['office'] and q["status"] != "archive"]
    questionnaire_office = [str(q["office"]) for q in questionnaire_list if q["office"] == questionnaire_data_['office'] and q["status"] != "archive"]
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

@app.route("/respondent_data", methods=['GET'])
def fetchRespondents():
    sorted_counts = []
    answer_data = server.answer_collection.find()
    answer_list = [al for al in answer_data]
    account_data = server.user_collection.find({"account_id": {"$exists": True}})
    account_list = [a for a in account_data]
    account_dict = {a["account_id"]: a["type"] for a in account_list}
    all_possible_types = ["student", "employee", "client_research"]
    type_counter = Counter()
    for al in answer_list:
        account_id = al.get("account_id")
        if account_id:
            account_type = account_dict.get(account_id, "Unknown")
            type_counter[account_type] += 1

    for user_type in all_possible_types:
        if user_type not in type_counter:
            type_counter[user_type] = 0

    sorted_counts = [type_counter[user_type] for user_type in all_possible_types]

    return jsonify(sorted_counts)

@app.route("/specific_respondent_data", methods=['POST'])
def fetchSpecificRespondents():
    client_type = request.get_json()
    answer_data = server.answer_collection.find()
    answer_list = [al for al in answer_data if al["office"] == client_type["office"]]
    account_data = server.user_collection.find({"account_id": {"$exists": True}})
    account_list = [a for a in account_data]
    account_dict = {a["account_id"]: a["type"] for a in account_list}
    all_possible_types = {"student", "employee", "client_research"}
    type_counter = {user_type: 0 for user_type in all_possible_types}

    for al in answer_list:
        account_id = al.get("account_id")
        if account_id:
            account_type = account_dict.get(account_id, "Unknown")
            if account_type in type_counter:
                type_counter[account_type] += 1
    
    sorted_counts = [type_counter[user_type] for user_type in all_possible_types]
    
    return jsonify(sorted_counts)

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

if __name__ == '__main__':
    app.run(port="8082")
