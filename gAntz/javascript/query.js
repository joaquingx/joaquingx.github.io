class Query{
    constructor(type){
        this.queryType = [
            {"type":"specimens", "parameters":[
                    "family","subfamily","genus","species","code","country","habitat","type","georeferenced",
                    "bbox","limit", "caste"
                ]},
            {"type":"geoSpecimens", "parameters":[
                    "coords", "radius", "limit", "offset", "distinct"
                ]}
        ];
        this.type = type;
        this.jsonType = this.queryType[this.type];
        this.url = "https://cors.io/?https://api.antweb.org/v3.1/" + this.jsonType["type"] + "?";
        this.options = {"family":"", "genus": "", "country":"Peru", "limit":"", "coords" : "",
            "Georeferenced": "1", "radius" : "2", "bbox":"", "month": "", "caste" : "Queen"};
        this.cacheJson = {};
        this.photosCollector={};
    };

    getJsonVoid() {
        return {"metaData": {"count": "0"} , "specimens" : [] };
    }

    getJsonDate(rawJson){
        var newJson = this.getJsonVoid();
        if(this.options["month"] !== undefined){
            for(var actJson in rawJson["specimens"]){
                if(rawJson["specimens"][actJson]["dateCollectedStart"] != undefined){
                    // console.log(rawJson["specimens"][actJson]["dateCollectedStart"]);
                    var myDate = new Date(rawJson["specimens"][actJson]["dateCollectedStart"])
                    var month = myDate.getMonth();
                    if(month == this.options["month"]){
                        //console.log(myDate);
                        newJson["specimens"].push(rawJson["specimens"][actJson]);
                    }
                }
            }
            newJson["metaData"]["count"] = newJson["specimens"].length;
            console.log(newJson);
            return newJson;
        }
        else{
            return rawJson;
        }
    };

    changeType(type){
        this.type = type;
        this.jsonType = this.queryType[this.type];
        this.url = "https://cors.io/?https://api.antweb.org/v3.1/" + this.jsonType["type"] + "?";
        var jsonType = this.queryType[this.type];
    };


    getHTML(image){
        if(image === undefined)
            image = "gAntz/assets/loading.gif";
        return "<div class='bordeame'>" +
            "<img width ='100px' height='100px' src='" + image +  "'/>"+
            "</div>"
    }


    getChart(rawJson) {
        var freqMap = new Map();
        for(var actJson in rawJson["specimens"]){
            var specie = rawJson["specimens"][actJson]["antwebTaxonName"];
            if(freqMap.get(specie) === undefined)
                freqMap.set(specie, 1);
            else
                freqMap.set(specie, freqMap.get(specie) + 1);
        }

        freqMap[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
        };

        var cnt  = 0;
        var data = {};
        var chartOptions = {};
        console.log("El freqmap: ");
        console.log(freqMap );
        for (let [key, value] of freqMap) {
            if(cnt < 4){
                // var antWebTaxon = rawJson["specimens"][actJson]["antwebTaxonName"];
                var url = "https://cors.io/?https://api.antweb.org/v3.1/taxaImages?shotType=p&limit=1&taxonName=";
                url += key;
                // console.log(key);
                var self = this;
                console.log("Lo que es photocollector:");
                console.log(this.photosCollector);
                console.log("termino photocollector");
                console.log("Comprobando esta key "+ key + "con esto: " + this.photosCollector[key]);
                if(this.photosCollector[key] === undefined){
                    var Consulta = jQuery.get(url, function (photos) {//myResult = data;
                        if(photos["taxaimages"] !== []){
                            photos = JSON.parse(photos);
                            console.log(photos);
                            self.photosCollector[photos["metaData"]["parameters"][0]["taxonName"]] = photos["taxaImages"][0]["specimen"][0]["images"][0]["urls:"][3];
                            console.log("Lo que es photocollector cuando esta en ajax:");
                            console.log(this.photosCollector);
                            console.log("termino photocollector ajax" );
                            console.log(photos["metaData"]["parameters"][0]["taxonName"]);
                            console.log(photos["taxaImages"][0]["specimen"][0]["images"][0]["urls:"][3]);
                        }
                        // asyncCnt++;
                    });
                }
                data[key] = value;
                if(cnt == 0) {
                    chartOptions[key] = {
                        fillColor: '#EDF8FB',
                        minValue: 0,
                        maxValue: 20,
                        maxHeight: 20,
                        displayText: function (value) {
                            console.log(key);
                            console.log(self.photosCollector[key]);
                            return self.getHTML(self.photosCollector[key]);
                        }
                    };
                }
                else if(cnt == 1){
                    chartOptions[key] =  {
                        fillColor: '#B2E2E2',
                        minValue: 0,
                        maxValue: 20,
                        // maxHeight: 20,
                        maxHeight:500,
                        maxWidth:500,
                        // height:500,
                        // width:600,
                        displayText: function (value) {
                            console.log(key);
                            console.log(self.photosCollector[key]);
                            return self.getHTML(self.photosCollector[key]);
                        }
                    };
                }
                else if(cnt == 2){
                    chartOptions[key] ={
                        fillColor: '#66C2A4',
                        minValue: 0,
                        maxValue: 20,
                        maxHeight: 20,
                        displayText: function (value) {
                            console.log(key);
                            console.log(self.photosCollector[key]);
                            return self.getHTML(self.photosCollector[key]);
                        }
                    };
                }
                else{
                    chartOptions[key] = {
                        fillColor: '#238B45',
                        minValue: 0,
                        maxValue: 20,
                        maxHeight: 20,
                        displayText: function (value) {
                            console.log(key);
                            console.log(self.photosCollector[key]);
                            return self.getHTML(self.photosCollector[key]);
                        }
                    };
                }
            }
            cnt++;
        }
        // console.log(data);
        // console.log(chartOptions);
        return [data,chartOptions];
        // freqMap.forEach( function dameElementos(value, key, freqmap){
        //     console.log(`m[${key}] = ${value}`);
        // })
    };

    getWithCache(map,e,layerController){
        if(this.cacheJson[this.options["country"]] !== ""){
            var myOption = this.cacheJson[this.options["country"]][1];
            console.log("myoption es :" + myOption);
            deleteMarkers(map,this.options["country"]);
            // console.log(this.cacheJson);
            console.log(this.getJsonDate(this.cacheJson[this.options["country"]][0]));
            // console.log("averavar\n");
            if(myOption === 0){
                var chartGod = this.getChart(this.getJsonDate(this.cacheJson[this.options["country"]][0]));
                var chartData = chartGod[0];
                var chartOptions = chartGod[1];
                console.log("entre");
                drawMarkersInMapChart(this.getJsonDate(this.cacheJson[this.options["country"]][0]),chartData,chartOptions,map,e,this.options["country"]);
                groupAllMarkers(map,layerController)
            }
            else if(myOption === 1){
                drawMarkersInMapDetail(this.getJsonDate(this.cacheJson[this.options["country"]][0]),map,this.options["country"]);
                groupAllMarkers(map,layerController)
            }

        }
    }

    dameConsulta(map,e,layerController){
        console.log("este es el cache:" + this.cacheJson[this.options["country"]]);
        if(this.cacheJson[this.options["country"]] === undefined) {
            var myUrl = this.url;
            //this.getJsonDate();
            for (var key in this.options) {
                if (jQuery.inArray(key, this.jsonType["parameters"]) != -1 && this.options[key] !== "") {
                    console.log(key, this.jsonType[key]);
                    myUrl += key + "=" + this.options[key] + "&";
                }
            }
            myUrl = myUrl.substr(0, myUrl.length - 1);
            console.log(myUrl);
            var Consulta;
            var self = this;
            Consulta = jQuery.get(myUrl, function (data) {//myResult = data;
                console.log(JSON.parse(data));
                data = JSON.parse(data);
                self.cacheJson[self.options["country"]] = [data,0];
                console.log(self.cacheJson[self.options["country"]]);
                self.getWithCache(map, e, layerController);
            });
        }
        else{
            console.log("Entre a la cache");
            this.cacheJson[this.options["country"]] = [this.cacheJson[this.options["country"]][0],
                1-this.cacheJson[this.options["country"]][1]];
            this.getWithCache(map,e,layerController);
        }
    };
}