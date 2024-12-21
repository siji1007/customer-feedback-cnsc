import pymongo
from pymongo import MongoClient
import certifi 
import dns.resolver
dns.resolver.default_resolver=dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers=['8.8.8.8']


connection = MongoClient(
    "mongodb+srv://CodeDemonz:legendaryCodeGodz24@cluster0.b9fts6m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    tlsCAFile=certifi.where()
)

db=connection.get_database('CFS')
user_collection = db['Accounts']
client_collection = db['Clients']
dept_collection = db['Department']
client_type_collection = db['Types']
questionnaire_collection = db['Questionnaires']
settings_collection = db['Settings']
answer_collection = db['Answers']
office_collection = db['Office']
session_collection = db['session']
colleges_collection = db['Colleges']
