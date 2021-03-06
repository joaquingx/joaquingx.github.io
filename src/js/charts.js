function createData(classToRetrieve,jsonFile){
    var dataPicante;
    var cntArray = new Map();
//    var self = this.sort();
    var path = "/assets/json/" + jsonFile + ".json";
    d3.queue()
        .defer(d3.json,path)
        .await(
            function(error, data){
                dataPicante = new Array(data[0].Scores.length);
                for(var i = 0 ; i < data[0].Scores.length+1; i++){
                    dataPicante[i] = new Array();
                }
                for(var i = 0 ; i < data.length ; i++){
                    for(var j = 0 ; j < data[i].Scores.length ; ++j){
                        dataPicante[j].push({"name": data[i].User, "value": data[i].Scores[j]});
                        if(cntArray.get(data[i].User) != undefined)
                            cntArray.set(data[i].User, parseInt(cntArray.get(data[i].User)) + parseInt(data[i].Scores[j]));
                        else
                            cntArray.set(data[i].User, parseInt(data[i].Scores[j]));
                        //dataPicante[j].push(data[i].User);
                    }
                }
                cntArray.forEach(function (value,key,map) {
                    dataPicante[data[0].Scores.length].push({"name" : key , "value" : value});
                });
                var margin = {
                        left: 100,
                        right: 20,
                        top: 20,
                        bottom: 30
                    },
                    tooltipContainer;
                var isH = false;
                var h = 250;
                if(screen.width <= 1100){
                    isH = true;
                    h = 600;
                }
                console.log(dataPicante.length);
                for(var k = 0 ; k < dataPicante.length -1 ; k++){
                    var barChart = new britecharts.bar();
                    var chartTooltip = new britecharts.miniTooltip();
                    var container = d3.select(classToRetrieve + k );
                    var newContainerWidth = container.node() ? container.node().getBoundingClientRect().width : false;

                    barChart
                        .isHorizontal(isH)
                        .margin(margin)
                        .xTicks(0)
                        .isAnimated(true)
                        .colorSchema(britecharts.colors.colorSchemas.britecharts)
                        .width(newContainerWidth)
                        .height(h)
                        .on('customMouseOver', chartTooltip.show)
                        .on('customMouseMove', chartTooltip.update)
                        .on('customMouseOut', chartTooltip.hide);
                    container.datum(dataPicante[k]).call(barChart);
                    tooltipContainer = d3.select('.bar-chart .metadata-group');
                    tooltipContainer.datum([]).call(chartTooltip);
                }
                var barChart = new britecharts.bar();
                var chartTooltip = new britecharts.miniTooltip();
                var newContainerWidth = container.node() ? container.node().getBoundingClientRect().width : false;

                barChart
                    .isHorizontal(isH)
                    .margin(margin)
                    .isAnimated(false)
                    .xTicks(0)
                    .colorSchema(britecharts.colors.colorSchemas.britecharts)
                    .width(newContainerWidth)
                    .height(h)
                    .on('customMouseOver', chartTooltip.show)
                    .on('customMouseMove', chartTooltip.update)
                    .on('customMouseOut', chartTooltip.hide);

                d3.select(classToRetrieve+"final" ).datum(dataPicante[dataPicante.length-1]).call(barChart);
                tooltipContainer = d3.select('.bar-chart .metadata-group');
                tooltipContainer.datum([]).call(chartTooltip);
            }
        )
}
