function importData(){
    d3.json("http://codeforces.com/api/user.status?handle=Fefer_Ivan&from=1&count=10",function(data){
        console.log(data.result);
        var canvas = d3.select(".dataContainer").append("svg")
            .attr("width",1000)
            .attr("height",700)

        canvas.selectAll("rect")
            .data(data.result)
            .enter()
            .append("rect")
            .attr("width",function (d) {
                return d.passedTestCount * 10;
            })
            .attr("height",50)
            .attr("y",function (d,i) {
                return i * 80;
            })
            .attr("fill","red");
        
        canvas.selectAll("text")
            .data(data.result)
            .enter()
            .append("text")
            .attr("fill","#ffffff")
            .attr("y", function (d,i) {
                return i* 80 + 25;
            })
            .attr("x",5)
            .text(function (d) {
                return d.author.members[0].handle;
            })
    })
}