var stackedBarData = {
    data:[
        {stack: "vivid", name: "Direct1", views: 0, date: "2011-01-01"},
        {stack: "vivid", name: "Direct2", views: 10, date: "2011-01-02"},
        {stack: "vivid", name: "Direct3", views: 16, date: "2011-01-03"},
        {stack: "vivid", name: "Direct4", views: 23, date: "2011-01-04"},
        {stack: "sparkling", name: "Eventbrite1", views: 23, date: "2011-01-05"},
        {stack: "sparkling", name: "Eventbrite2", views: 16, date: "2011-01-06"},
        {stack: "sparkling", name: "Eventbrite3", views: 10, date: "2011-01-07"},
        {stack: "sparkling", name: "Eventbrite4", views: 0, date: "2011-01-08"},
        {stack: "sunny", name: "Email1", views: 10, date: "2011-01-10"},
        {stack: "sunny", name: "Email2", views: 20, date: "2011-01-06"},
        {stack: "sunny", name: "Email3", views: 26, date: "2011-01-07"},
        {stack: "sunny", name: "Email4", views: 33, date: "2011-01-08"}
    ]
};

function stackedChart() {
    var stackedBarChart = new britecharts.stackedBar(),
        chartTooltip = britecharts.tooltip(),
        container = d3.select('.js-stacked-bar-chart-tooltip-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer;

    stackedBarChart
        .tooltipThreshold(100)
        .width(containerWidth)
        .grid('horizontal')
        .isAnimated(true)
        .stackLabel('stack')
        .nameLabel('date')
        .valueLabel('views')
        .on('customMouseOver', function () {
            chartTooltip.show();
        })
        .on('customMouseMove', function (dataPoint, topicColorMap, x, y) {
            chartTooltip.update(x, y);
            console.log(dataPoint);
            console.log(topicColorMap);
            console.log(x);
            console.log(y);
        })
        .on('customMouseOut', function () {
            chartTooltip.hide();
        });

    container.datum(stackedBarData.data).call(stackedBarChart);

    chartTooltip
        .topicLabel('values')
        .dateLabel('key')
        .nameLabel('stack')
        .title('Tooltip title');

    tooltipContainer = d3.select('.js-stacked-bar-chart-tooltip-container .metadata-group');
    tooltipContainer.datum([]).call(chartTooltip);
}

//let barData = {
//    data:[
//        {name: "A", value: 0.08167},
//        {name: "B", value: 0.01492},
//        {name: "C", value: 0.02782},
//        {name: "D", value: 0.04253},
//        {name: "E", value: 0.12702},
//        {name: "F", value: 0.02288},
//        {name: "G", value: 0.02015},
//        {name: "H", value: 0.06094},
//        {name: "I", value: 0.06966},
//        {name: "Joaquin", value: 0.00153},
//        {name: "K", value: 0.00772},
//        {name: "L", value: 0.04025},
//        {name: "M", value: 0.02406},
//        {name: "N", value: 0.06749},
//        {name: "O", value: 0.07507},
//        {name: "P", value: 0.01929},
//        {name: "Q", value: 0.00095},
//        {name: "R", value: 0.05987},
//        {name: "S", value: 0.06327},
//        {name: "T", value: 0.09056},
//        {name: "U", value: 0.02758},
//        {name: "V", value: 0.00978},
//        {name: "W", value: 0.0236},
//        {name: "X", value: 0.0015},
//        {name: "Y", value: 0.01974},
//        {name: "Z", value: 0.00074}
//    ]
//};

function createBarChart() {
    console.log(barData.data[0].name);
    var barChart = new britecharts.bar(),
        chartTooltip = new britecharts.miniTooltip(),
        margin = {
            left: 120,
            right: 20,
            top: 20,
            bottom: 30
        },
        barContainer = d3.select('.js-bar-chart-tooltip-container'),
        containerWidth = barContainer.node() ? barContainer.node().getBoundingClientRect().width : false,
        tooltipContainer;

    barChart
        //.isHorizontal(true)
        .isAnimated(true)
        .colorSchema(britecharts.colors.colorSchemas.britecharts)
        .width(500)
        //x.yAxisPaddingBetweenChart(30)
        .height(500)
        //.percentageAxisToMaxRatio(1.3)
        .on('customMouseOver', chartTooltip.show)
        .on('customMouseMove', chartTooltip.update)
        .on('customMouseOut', chartTooltip.hide);

    barContainer.datum(barData.data).call(barChart);

    tooltipContainer = d3.select('.bar-chart .metadata-group');
    tooltipContainer.datum([]).call(chartTooltip);
}

function createData(){
    var dataPicante;
    var cntArray = new Map();
    d3.queue()
        .defer(d3.json,"/assets/json/final.json")
        .await(
            function(error, data){
                console.log(dataPicante);
                dataPicante = new Array(data[0].Scores.length);
                for(var i = 0 ; i < data[0].Scores.length+1; i++){
                    dataPicante[i] = new Array();
                }
                for(var i = 0 ; i < data.length ; i++){
                    for(var j = 0 ; j < data[i].Scores.length ; ++j){
                        //dataPicante[j].push({data[i].User : data[i].Scores[j]});
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
                console.log(dataPicante);
                console.log(cntArray)
                var margin = {
                        left: 120,
                        right: 20,
                        top: 20,
                        bottom: 30
                    },
                    barContainer = d3.select('.js-bar-chart-tooltip-container'),
                    tooltipContainer;

                console.log(dataPicante.length);
                // var iDiv = document.createElement('div');
                // iDiv.id = 'block';
                // iDiv.className = 'block';
                // document.getElementsByTagName('body')[0].appendChild(iDiv);
                for(var k = 0 ; k < dataPicante.length -1 ; k++){
                    var barChart = new britecharts.bar();
                    var chartTooltip = new britecharts.miniTooltip();
                    var container = d3.select(".competitive" + k )
                    var newContainerWidth = container.node() ? container.node().getBoundingClientRect().width : false;

                    barChart
                        .isHorizontal(false)
                        .margin(margin)
                        .isAnimated(true)
                        .labelsSize(50)
                        .colorSchema(britecharts.colors.colorSchemas.britecharts)
                        .width(newContainerWidth)
                        //x.yAxisPaddingBetweenChart(30)
                        .height(200)
                        //.percentageAxisToMaxRatio(1.3)
                        .on('customMouseOver', chartTooltip.show)
                        .on('customMouseMove', chartTooltip.update)
                        .on('customMouseOut', chartTooltip.hide);

                    //container = d3.select(".block");
                    console.log(dataPicante[k]);
                    console.log(".algo" + k);
                    container.datum(dataPicante[k]).call(barChart);

                    tooltipContainer = d3.select('.bar-chart .metadata-group')
                    tooltipContainer.datum([]).call(chartTooltip);
                }
                var barChart = new britecharts.bar();
                var chartTooltip = new britecharts.miniTooltip();
                var container = d3.select(".competitive" + k )
                var newContainerWidth = container.node() ? container.node().getBoundingClientRect().width : false;
                barChart
                    .isHorizontal(false)
                    .margin(margin)
                    .isAnimated(true)
                    .labelsSize(50)
                    .colorSchema(britecharts.colors.colorSchemas.britecharts)
                    .width(newContainerWidth)
                    //x.yAxisPaddingBetweenChart(30)
                    .height(300)
                    //.percentageAxisToMaxRatio(1.3)
                    .on('customMouseOver', chartTooltip.show)
                    .on('customMouseMove', chartTooltip.update)
                    .on('customMouseOut', chartTooltip.hide);

                d3.select(".competitivefinal" ).datum(dataPicante[dataPicante.length-1]).call(barChart);

                tooltipContainer = d3.select('.bar-chart .metadata-group')
                tooltipContainer.datum([]).call(chartTooltip);
            }
        )
}
