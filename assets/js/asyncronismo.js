myJson = new Map();

function solvedPerContestant(error,history,handles,contests,callback){
    for(var m = 0 ; m < history.length; ++m) {
        var cleanHistory = history[m].result;
        var solvedProblems = [];
        for (var l = 0; l < contests.length; ++l) {
            var contestantName = cleanHistory[0].author.members[0].handle;
            if (myJson.get(contestantName) == undefined)
                myJson.set(contestantName, [0]);
            else
                myJson.get(contestantName).push(0);
            for (var j = 0; j < cleanHistory.length; ++j) {
                var unixTimeBegin = new Date(contests[l].Begin).getTime() / 1000; // Converting to UNIX TIME
                var unixTimeEnd = new Date(contests[l].End).getTime() / 1000;
                if (unixTimeBegin <= cleanHistory[j].creationTimeSeconds &&
                    unixTimeEnd >= cleanHistory[j].creationTimeSeconds &&
                    cleanHistory[j].verdict == "OK") {
                    if (contests[l].Problems.includes(cleanHistory[j].problem.contestId + cleanHistory[j].problem.index)
                        && !(solvedProblems.includes(cleanHistory[j].problem.contestId + cleanHistory[j].problem.index))
                    ) {
                        solvedProblems.push(cleanHistory[j].problem.contestId + cleanHistory[j].problem.index);
                        if(cleanHistory[j].problem.points != undefined)
                            myJson.get(contestantName)[myJson.get(contestantName).length - 1] += cleanHistory[j].problem.points;
                        else{
                            myJson.get(contestantName)[myJson.get(contestantName).length - 1] += 500;
                        }
                    }
                }
            }
        }
    }
    callback(null);
}


function unaVaina(error,handles,contests,callback) {
    console.log(handles);
    console.log(contests);
    var cola = d3.queue();
    for(var i = 0 ; i < handles.length ; ++i){
        sleep(300);
        cola.defer(d3.json,"http://codeforces.com/api/user.status?handle=" + handles[i].name + "&from=1&count=150");
    }
    cola.awaitAll(function (error,history) {
        d3.queue()
            .defer(solvedPerContestant,error,history,handles,contests)
            .await(
                function (error) {
                    callback(null);
                }
            )
    });
}


function probando(){
    d3.queue()
        .defer(d3.json, "/assets/js/usuarios.json")
        .defer(d3.json, "/assets/js/concurso.json")
        .await(
            function(error,handles,contests){
                d3.queue()
                    .defer(unaVaina,error,handles,contests)
                    .await(
                        function(error) {
                            console.log("batman batman batman");
                            console.log(myJson);
                            document.write("[<br/>");
                            myJson.forEach(
                                function (value,key,map) {
                                    document.write("{\"User\":\"" + key  + "\", \"Scores\" : [" );
                                    for(var i = 0 ; i < value.length ; ++i){
                                        if(i != value.length - 1)
                                            document.write("\"" + value[i] +"\" " + ", ");
                                        else
                                            document.write("\"" + value[i] +"\" ");
                                    }
                                    document.write("]},<br/>");
                                }
                            );
                            document.write("]");
                        }
                    )

            }
        );
}