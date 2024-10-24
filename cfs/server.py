import pymongo
from pymongo import MongoClient
import dns.resolver
dns.resolver.default_resolver=dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers=['8.8.8.8']


connection=MongoClient("mongodb+srv://CodeDemonz:legendaryCodeGodz24@cluster0.b9fts6m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db=connection.get_database('CFS')
user_collection=pymongo.collection.Collection(db,'Accounts')
client_collection=pymongo.collection.Collection(db, 'Clients')
dept_collection=pymongo.collection.Collection(db,'Department')
client_type_collection=pymongo.collection.Collection(db, 'Types')
questionnaire_collection=pymongo.collection.Collection(db,'Questionnaires')
settings_collection=pymongo.collection.Collection(db, 'Settings')
answer_collection=pymongo.collection.Collection(db, 'Answers')
office_collection=pymongo.collection.Collection(db, 'Office')
