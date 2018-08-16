import requests
import time
import datetime
import json
import pprint

user_json = json.load(open("src/scripts/json/usuarios.json"))
contest_json = json.load(open("src/scripts/json/contests.json"))
result_scores = []


for user_idx in range(len(user_json)):
    user_name = user_json[user_idx]["name"]
    #getting request for user
    user_link = "http://codeforces.com/api/user.status?handle=" + user_name + "&from=1&count=100"
    user_raw = requests.get(user_link)
    user_structured = user_raw.json()["result"]
    result_scores.append({"User":user_name, "Scores": list()})
    for contest_idx in range(len(contest_json)):
        contest_begin = contest_json[contest_idx]["Begin"]
        contest_end = contest_json[contest_idx]["End"]

        #Probably induces a bug TODO
        contest_begin_timestamp = int(time.mktime(
            datetime.datetime.strptime(contest_begin, "%a, %d %b %Y %H:%M:%S %Z").timetuple())) - (3600*5)
        contest_end_timestamp = int(time.mktime(
            datetime.datetime.strptime(contest_end, "%a, %d %b %Y %H:%M:%S %Z").timetuple())) - (3600*5)
        # Probably induces a bug

        contest_problems = contest_json[contest_idx]["Problems"]
        total_points = 0
        record_list_problems = []
        for r_idx in range(len(user_structured)):
            record = user_structured[r_idx]
            record_problem = str(record["problem"]["contestId"]) + record["problem"]["index"]
            record_points = record["problem"].get("points", 500)
            record_timestamp = record["creationTimeSeconds"]
            record_verdict_ok = (record["verdict"] == "OK")
            if record_verdict_ok and record_problem in contest_problems and record_problem not in record_list_problems:
                if contest_begin_timestamp <= record_timestamp <= contest_end_timestamp:
                    total_points += record_points
                    record_list_problems.append(record_problem)
        result_scores[user_idx]["Scores"].append(total_points)

# pp = pprint.PrettyPrinter(indent=4)
# pp.pprint(result_scores)
print(result_scores)

