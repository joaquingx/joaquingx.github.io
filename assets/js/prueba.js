var myJson = new Map();

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function charginUsers(callback){
    setTimeout( function() {
        d3.json("/assets/js/usuarios.json", function (data) {
            console.log(data);
            var canvas = d3.select(".dataContainer").append("svg")
                .attr("width", 1000)
                .attr("height", 700);
//        document.write("[\n");
            for (var i = 0; i < data.length; i++) {
                sleep(2000);
//            document.write("{\"user\":")
//            document.write(" \"" + data[i].name +"\" , \" contest\" : [")
                d3.request("http://codeforces.com/api/user.status?handle=" + data[i].name + "&from=1&count=50")
                    .mimeType("application/json")
                    .response(function (xhr) {
                        return JSON.parse(xhr.responseText);
                    })
                    .get(function (d2) {
                        console.log(d2.result);
                        var hisData = d2.result;
                        d3.json("/assets/js/concurso.json", function (datita) {
                            var problema, solvedProblem;
                            console.log(datita)
                            for (var l = 0; l < datita.length; l++) {
                                var solved = 0;
                                var unixTimeBegin = new Date(datita[l].Begin).getTime() / 1000; // Converting to UNIX TIME
                                var unixTimeEnd = new Date(datita[l].End).getTime() / 1000;
                                for (var j = 0; j < hisData.length; j++) {
                                    if (hisData[j].creationTimeSeconds > unixTimeBegin && hisData[j].creationTimeSeconds < unixTimeEnd
                                        && hisData[j].verdict == "OK") {
                                        for (var x = 0; x < datita[l].Problems.length; x++) {
                                            problema = datita[l].Problems[x];
                                            solvedProblem = hisData[j].problem.contestId + hisData[j].problem.index;
                                            if (problema == solvedProblem)
                                                ++solved;
                                        }
                                    }
                                }
                                if (myJson.get(hisData[0].author.members[0].handle) == undefined)
                                    myJson.set(hisData[0].author.members[0].handle, [solved]);
                                else
                                    myJson.get(hisData[0].author.members[0].handle).push(solved);
                                //document.write("\"" + solved + "\",")
                            }
                            //document.write("]\n")
                        })
                    })
            }
        });
    },1000);
}

function delayedHello(name, delay, callback) {
    setTimeout(function() {
        console.log("Hello, " + name + "!");
        callback(null);
    }, delay);
}


function importData(){
    var q = d3.queue();
    q.defer(delayedHello,"Alice",30);
    q.defer(delayedHello,"Alicaaaa",1000);
    q.defer(charginUsers);
    q.awaitAll( function (error) {
        if(error) throw error;
        myJson.forEach(function (value, key, map) {
            console.log(key + " = " + value);
        })
        console.log("solo en derrechoexs");
        }
    );
}