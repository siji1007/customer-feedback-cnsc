import random
import csv, server

# Define colleges and programs
colleges_and_programs = {
    "CBPA": ["BSBA-BE", "BSBA-MM", "BSBA-HRM", "BSBA-FM", "BPA", "BSHM", "BSA", "BSOA", "BSE"],
    "CAS": ["BSDEVCOM", "BSAM", "BSBIO", "BA-ELS", "BA-HISTORY", "BA-SOCIOLOGY"],
    "COENG": ["BSCE", "BSEE", "BSME"],
    "CCMS": ["BSIT", "BSIS"],
    "COED": ["BSED-ENG", "BSED-FIL", "BSED-MATH", "BSED-SCI", "BSED-SOCSTUD", "BEED", "BTLED", "BPE"],
    "IFMS": ["BS-FISHERIES"],
    "CANR": ["BSAGRI-CS", "BSAGRI-AS", "BSES", "BSAB", "BAT"],
    "COTT": ["BTVTE-GFD", "BTVTE-FSM", "BTVTE-AT", "BTVTE-ET"],
    "ENTIENZA": ["BSE-ENG", "BSE-MATH", "BEED", "BS-ENTREP"],
}

ccms = ["BSIT", "BSIS"]
blocks = ['1A', '1B', '1C', '2A', '2B', '3A', '3B', '4A', '4B']
semester = ['1st Semester', '2nd Semester']
acad_year = ["2021-2022", "2022-2023"]
services = [
    'ADMISSION', 'REGISTRAR', 'GUIDANCE OFFICE', 'HEALTH SERVICES/CLINIC', 
    'LIBRARY SERVICES', 'STUDENT PUBLICATION', 'SCHOLARSHIP', 
    'STUDENT SERVICES OFFICE'
]

# Generate a random name
def generate_random_full_name():
    first_names = ["John", "Jane", "Alex", "Emma", "Chris", "Katie", "David", "Sophia"]
    last_names = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Taylor", "Wilson", "Moore"]
    return f"{random.choice(first_names)} {random.choice(last_names)}"

# Generate a random username
def generate_random_username():
    return f"user_{random.randint(1000, 9999)}"

# Map block to year
def get_year_from_block(block):
    year_map = {
        '1': "1st Year",
        '2': "2nd Year",
        '3': "3rd Year",
        '4': "4th Year",
    }
    return year_map.get(block[0], "Unknown Year")

def get_distribution():
    # Total apples and number of containers
    total_apples = 651
    num_containers = 18
    min_apples = 30
    max_apples = 50

    # Initialize all containers with the minimum apples
    containers = [min_apples] * num_containers

    # Remaining apples after initial distribution
    remaining_apples = total_apples - sum(containers)

    # Distribute the remaining apples
    i = 0
    while remaining_apples > 0:
        if(containers[i] < max_apples):
            containers[i] += 1
            remaining_apples -= 1
        i = (i + 1) % num_containers  # Move to the next container

    # Print the result
    return containers


# Load CSV and process students
with open('21-22.csv', mode='r') as file:
    csv_reader = list(csv.reader(file))  # Convert reader to a list to allow multiple iterations

    it_distribution = get_distribution()[0:8]
    is_distribution = get_distribution()[8:16]
    
    k = 0
    l = 0
    ayc = 0
    while(ayc < 2):
        while l < 2:
            while k < 8:
                for i in it_distribution:
                    for j in range(1, i + 1):
                        username = generate_random_username()
                        name = generate_random_full_name()
                        email = username + "@gmail.com"
                        print(username)
                        print(name)
                        print("CCMS")
                        print(ccms[l])
                        print(get_year_from_block(blocks[k]))
                        print(blocks[k])
                        print(email)
                        print(semester[ayc])

                        user = {
                            "username": username,
                            "name": name,
                            "college": "CCMS",
                            "program": ccms[l],
                            "year": get_year_from_block(blocks[k]),
                            "block": blocks[k],
                            "email": f"{username}@example.com",
                        }

                        answer = {
                            "username": username,
                            "answers": {
                                "services": {
                                    f"{services[0]}": csv_reader[j - 1][0:5],
                                    f"{services[1]}": csv_reader[j - 1][5:10],
                                    f"{services[2]}": csv_reader[j - 1][10:15],
                                    f"{services[3]}": csv_reader[j - 1][15:20],
                                    f"{services[4]}": csv_reader[j - 1][20:25],
                                    f"{services[5]}": csv_reader[j - 1][25:30],
                                    f"{services[6]}": csv_reader[j - 1][30:35],
                                    f"{services[7]}": csv_reader[j - 1][35:40],
                                },
                                "comment": {
                                    f"{services[0]}": csv_reader[j - 1][-2],
                                    f"{services[1]}": csv_reader[j - 1][-2],
                                    f"{services[2]}": csv_reader[j - 1][-2],
                                    f"{services[3]}": csv_reader[j - 1][-2],
                                    f"{services[5]}": csv_reader[j - 1][-2],
                                    f"{services[6]}": csv_reader[j - 1][-2],
                                    f"{services[7]}": csv_reader[j - 1][-2],
                                },
                            },
                            "semester": random.choice(semester),
                            "ay": random.choice(acad_year),
                        }
                    k += 1
            l+=1
        ayc += 1

    """m = 0
    n = 0
    while n < 2:
        while m < 8:
            for i in it_distribution:
                for j in range(1, i + 1):
                    username = generate_random_username()
                    name = generate_random_full_name()
                    email = username + "@gmail.com"
                    print(username)
                    print(name)
                    print("CCMS")
                    print(ccms[n + 1])
                    print(get_year_from_block(blocks[m]))
                    print(blocks[m])
                    print(email)
                m += 1
        n+=1"""

    # Iterate over distribution and CSV rows
    """for college, programs in distribution.items():
        for program, counts in programs.items():
            for block, count in zip(blocks, counts):
                for _ in range(count):  # Loop to generate the number of students for this block
                    for row in csv_reader:
                        username = generate_random_username()
                        name = generate_random_full_name()
                        year = get_year_from_block(block)

                        user = {
                            "username": username,
                            "name": name,
                            "college": college,
                            "program": program,
                            "year": year,
                            "block": block,
                            "email": f"{username}@example.com",
                        }

                        answer = {
                            "username": username,
                            "answers": {
                                "services": {
                                    f"{services[0]}": row[0:5],
                                    f"{services[1]}": row[5:10],
                                    f"{services[2]}": row[10:15],
                                    f"{services[3]}": row[15:20],
                                    f"{services[4]}": row[20:25],
                                    f"{services[5]}": row[25:30],
                                    f"{services[6]}": row[30:35],
                                    f"{services[7]}": row[35:40],
                                },
                                "comment": {
                                    f"{services[0]}": row[-2],
                                    f"{services[1]}": row[-2],
                                    f"{services[2]}": row[-2],
                                    f"{services[3]}": row[-2],
                                    f"{services[5]}": row[-2],
                                    f"{services[6]}": row[-2],
                                    f"{services[7]}": row[-2],
                                },
                            },
                            "semester": random.choice(semester),
                            "ay": random.choice(acad_year),
                        }

                        


                        # Uncomment to save to database
                        #server.user_collection.insert_one(user)
                        #server.answer_collection.insert_one(answer)

                        #print(user)
                        print(answer)
                        #print(row[-2])"""
        
                   
                        


