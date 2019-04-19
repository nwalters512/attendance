import os
import os.path as path
import sys
import csv
import random
from collections import OrderedDict

uin_map = {}
netid_map = {}
name_map = {}


def anon_uin(uin):
    if uin in uin_map:
        new_uin = uin_map[uin]
    else:
        new_uin = len(uin_map)
        uin_map[uin] = new_uin
    return "6%08d" % (new_uin)

def anon_netid(netid):
    if netid in netid_map:
        new_netid = netid_map[netid]
    else:
        new_netid = len(netid_map)
        netid_map[netid] = new_netid
    return "netid_%03d" % (new_netid)

def anon_email(email):
    return anon_netid(email.split("@")[0]) + "@illinois.edu"

def _anon_name(name):
    if name in name_map:
        new_name = name_map[name]
    else:
        new_name = len(name_map)
        name_map[name] = new_name
    return new_name

def anon_fname(name):
    return "fname_%03d" % (_anon_name(name))

def anon_lname(name):
    return "lname_%03d" % (_anon_name(name))

def anon_pname(name):
    if (name == ""):
        return ""
    return "pname_%03d" % (_anon_name(name))

def random_read(file_name):
    with open(file_name, "r") as f:
        lines = f.readlines()

    lines_rest = lines[1:]
    lines = [lines[0]]
    random.shuffle(lines_rest)
    lines.extend(lines_rest)
    return lines

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 %s <roster.csv> <section_folder>" % (sys.argv[0]))
        sys.exit(1)

    roster_filename = sys.argv[1]
    sections_folder = sys.argv[2]

    ### Parse Roster ###
    roster_lines = random_read(roster_filename)
    roster_reader = csv.DictReader(roster_lines)
    anon_roster = []
    for roster_line in roster_reader:
        roster_line["Net ID"] = anon_netid(roster_line["Net ID"])
        roster_line["UIN"] = anon_uin(roster_line["UIN"])
        roster_line["Email Address"] = anon_email(roster_line["Email Address"])
        roster_line["Last Name"] = anon_lname(roster_line["Last Name"])
        roster_line["First Name"] = anon_fname(roster_line["First Name"])
        roster_line["Preferred Name"] = anon_pname(roster_line["Preferred Name"])
        anon_roster.append(roster_line)

    new_roster_filename = roster_filename.replace(".csv", "_anon.csv")
    assert ("_anon.csv" in  new_roster_filename)
    with open(new_roster_filename, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(anon_roster[0].keys()),extrasaction="ignore")
        writer.writeheader()
        for row in anon_roster:
            writer.writerow(row)

    ### Parse Sections ###
    section_filenames = filter(lambda f: not f.startswith("_"), os.listdir(sections_folder))
    section_filenames = map(lambda f: path.join(sections_folder,f), section_filenames)
    ci_term = "Fall"
    ci_year = 2018
    ci_name = "CS 225"
    section_names = set()
    meeting_names = set()
    swipes = []

    for sm_filename in section_filenames:
        sm_lines = random_read(sm_filename)
        reader = csv.DictReader(sm_lines)

        for row in reader:
            try:
                section, meeting = row["section_name"].strip().split(" ")
            except:
                print(row["section_name"])
                raise
            section_names.add(section)
            meeting_names.add(meeting)

            d = OrderedDict()
            d["UIN"] = anon_uin(row["uin"])
            d["stu_ci_term"] = ci_term
            d["stu_ci_year"] = ci_year
            d["stu_ci_name"] = ci_name
            d["meeting_name"] = meeting
            d["sec_name"] = section
            d["swipe_timestamp"] = row["timestamp"]

            swipes.append(d)

    with open(path.join(sections_folder, "_swipes.csv"), "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(swipes[0].keys()),extrasaction="ignore")
        writer.writeheader()
        for row in swipes:
            writer.writerow(row)

    
    with open(path.join(sections_folder, "_sections.csv"), "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=("name","ci_term","ci_name","ci_year"))
        writer.writeheader()
        for s_name in section_names:
            writer.writerow({"name": s_name, "ci_term": ci_term, "ci_name": ci_name,
                "ci_year": ci_year})
    with open(path.join(sections_folder, "_meetings.csv"), "w") as f:
        writer = csv.DictWriter(f, fieldnames=("name","ci_term","ci_name","ci_year"))
        writer.writeheader()
        for m_name in meeting_names:
            writer.writerow({"name": m_name, "ci_term": ci_term, "ci_name": ci_name,
                "ci_year": ci_year})
    with open(path.join(sections_folder, "_sectionMeetings.csv"), "w") as f:
        writer = csv.DictWriter(f, fieldnames=("m_name", "s_name","ci_term","ci_name","ci_year"))
        writer.writeheader()
        for m_name in meeting_names:
            for s_name in section_names:
                writer.writerow({"s_name": s_name, "m_name": m_name, "ci_term": ci_term, 
                    "ci_name": ci_name, "ci_year": ci_year})


if __name__ == "__main__":
    main()
