const arr = {
    "academicCalendar": "202002",
    "courseID": "2016101",
    "teacherID": "1100110",
    "298001": " COMENTARIOS ",
    "298002": 1,
    "298003": 1,
    "298004": 1,
    "298005": 1,
    "298006": 1,
    "298007": 1,
    "298008": 1,
    "298009": ["puntualidad", "herramientas", "pedagogia", "respeto", "atencion"],
    "options":
    {
        "299001": 1,
        "299002": 1,
        "299003": 1,
        "299004": 1,
        "299005": 1
    }
}
let test  = JSON.stringify(arr)
let body = JSON.parse(test)
let auxArr = [...body["298009"]]
console.log(auxArr)