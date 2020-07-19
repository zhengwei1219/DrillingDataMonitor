
function HLBDCurveObj(headCanvas, dataCanvas) {

    BaseCurve.call(this, headCanvas, dataCanvas);
    var arr = new Array();
    arr.push(new rect("钻压/钻速/垂深", 150));
    arr.push(new rect("深\n度", 50));
    arr.push(new rect("电阻率", 150));
    arr.push(new rect("循环当量/\n泥浆入口密度", 150));
    arr.push(new rect("伽马/\n大钩高度", 150));
    arr.push(new rect("孔隙度/\n密度", 150));
    arr.push(new rect("录井气测", 150));
    arr.push(new rect("岩性剖面", 150));
    arr.push(new rect("荧\n光\n级\n别", 50));
    arr.push(new rect("岩性描述", 150));
    this.rectArray = arr;
}
HLBDCurveObj.prototype = new BaseCurve();
HLBDCurveObj.prototype.startIntervval=function () {
    efreshCount = 0;
    HLBD = this;
    setInterval(this.drawDataLines, this.config.efreshTime);
}
HLBDCurveObj.prototype.drawHeadFram=function () {
    //var canwidth = $(document).width() - 20;
    //var canheight = 400;
    this.headCanvas.attr("width", this.config.canvasHeadWidth);
    this.headCanvas.attr("height", this.config.canvasHeadHeight);
    //this.headCanvas.drawLine({
    //    fillStyle: '#ffffff',
    //    layer: true,
    //    x1: 0, y1: 0,
    //    x2: this.config.canvasHeadWidth, y2: 0,
    //    x3: this.config.canvasHeadWidth, y3: this.config.canvasHeadHeight,
    //    x4: 0, y4: this.config.canvasHeadHeight,
    //    closed: true
    //});
    var headLineStr = '{"电阻率": [{"strokeStyle": "red","name": "FTC","unit": "(m/hr)","startMark": "150","endMark": "0"}],"钻压/钻速/垂深": [{"strokeStyle": "black","name": "FTC","unit": "(m/hr)","startMark": "150","endMark": "0"},{"strokeStyle": "red","name": "FTC","unit": "(m/hr)","startMark": "150","endMark": "0"}]}';
    var headLineObj = $.parseJSON(headLineStr);

    var rectX = 0;
    var arr = this.rectArray;
    for (var i = 0; i < arr.length; i++) {


        if (i != 0) {
            rectX += arr[i - 1].width;
        } else {
            rectX = 100;
        }
        var textX = rectX + arr[i].width / 2;
        var name = "curveHead" + i;
        this.headCanvas.drawRect({
            strokeStyle: '#000',
            strokeWidth: 2,
            layer: true,
            draggable: true,
            x: rectX, y: 100,
            width: arr[i].width,
            height: this.config.canvasHeadHeight * 0.9,
            fromCenter: false,
            groups: [name],
            name: name,
            dragGroups: [name],
            restrictDragToAxis: 'x'
        }).drawText({
            fillStyle: 'blue',
            x: textX, y: 175,
            fontSize: 18,
            text: arr[i].text,
            fontFamily: '宋体',
            groups: [name],
            dragGroups: [name],
            restrictDragToAxis: 'x'
        })
            .mousedown(function (e) {
                if (e.which == 3) {  // 1 = 鼠标左键; 2 = 鼠标中键; 3 = 鼠标右键
                    contextmenufun(e);
                }
            });



        var layer = this.headCanvas.getLayer(name);
        for (var j = 0;headLineObj[arr[i].text]!=null&&j < headLineObj[arr[i].text].length; j++) {
            var lineArr = headLineObj[arr[i].text]
            //头上的数据描述线绘制
            var objhead = {
                strokeStyle: lineArr[j].strokeStyle,
                layer: true,
                strokeWidth: 3,
                rounded: true
            };
            objhead['x1'] = layer.x + 1;
            objhead['y1'] = layer.y + layer.height / 2.5 + 40*j;
            objhead['x2'] = layer.x + layer.width - 1;
            objhead['y2'] = layer.y + layer.height / 2.5 + 40*j;
            this.headCanvas.drawLine(objhead)
            .drawText({
                fillStyle: lineArr[j].strokeStyle,
                layer: true,
                x: objhead['x1'] + layer.width / 2, y: objhead['y1']-10,
                fontSize: 12,
                text: lineArr[j].name,
                fontFamily: '宋体'
            }).drawText({
                fillStyle: lineArr[j].strokeStyle,
                layer: true,
                x: objhead['x1'] + layer.width / 2, y: objhead['y1'] + 10,
                fontSize: 12,
                text: lineArr[j].unit,
                fontFamily: '宋体'
            }).drawText({
                fillStyle: lineArr[j].strokeStyle,
                layer: true,
                x: objhead['x1'] + 10, y: objhead['y1'] + 10,
                fontSize: 12,
                text: lineArr[j].startMark,
                fontFamily: '宋体'
            }).drawText({
                fillStyle: lineArr[j].strokeStyle,
                layer: true,
                x: objhead['x2'] - 10, y: objhead['y2'] + 10,
                fontSize: 12,
                text: lineArr[j].endMark,
                fontFamily: '宋体'
            });
        }
    }

      
}

HLBDCurveObj.prototype.clearDataFram=function(){
    var arr = this.rectArray;
    for (var i = 0; i < arr.length; i++) {
        this.dataCanvas.removeLayer(arr[i].text).drawLayers();
        for (var j = 0; j < 10; j++) {
            this.dataCanvas.removeLayer(arr[i].text+"Y"+j).drawLayers();
        }
        for (var K  = 0; K < Math.floor(this.config.canvasDataHeight / 100) ; K++) {
            this.dataCanvas.removeLayer(arr[i].text + "X" + K).drawLayers();
        }
        if (arr[i].text === "深\n度")
        {
            for (var H = 0; H < Math.floor(this.config.canvasDataHeight / 100) ; H++) {
                this.dataCanvas.removeLayer(arr[i].text + "Depth" + H).drawLayers();
                this.dataCanvas.removeLayer(arr[i].text + "Depth" + "right"+ H).drawLayers();
                this.dataCanvas.removeLayer(arr[i].text + "Depth" + "text" + H).drawLayers();
            }
        }
            
    }
        
    this.dataCanvas.removeLayer("area_line_y").drawLayers();
}

HLBDCurveObj.prototype.drawDataFram=function()
{
        
    //var canwidth = $(document).width() - 20;
    //var canheight = 400;
    this.dataCanvas.attr("width", this.config.canvasDataWidth);
    this.dataCanvas.attr("height", this.config.canvasDataHeight);

    //this.dataCanvas.drawRect({
    //    fillStyle: '#ffffff',
    //    layer: true,
    //    x: 0, y: 0,
    //    width: this.config.canvasDataWidth,
    //    height: this.config.canvasDataHeight,
    //    fromCenter: false
    //});



    var rectX = 0;
    var arr = this.rectArray;
    for (var i = 0; i < arr.length; i++) {


        if (i != 0) {
            rectX += arr[i - 1].width;
        } else {
            rectX = 100;
        }
            
        //.drawLine({
        //    strokeStyle: '#000',
        //    strokeWidth: 2,
        //    x1: 100, y1: 50,
        //    x2: 250, y2: 50,
        //    layer: true
        //    // x3: 250, y3: 200,
        //    // x4: 100, y4: 200,
        //    //closed: true
        //})
        ;
        //var name = "curve_area_" + (i + 1);
        var name = arr[i].text;
           
        this.dataCanvas.drawRect({
            strokeStyle: '#000',
            strokeWidth: 2,
            layer: true,
            name: name,
           // draggable: false,
            x: rectX, y: 0,
            width: arr[i].width,
            height: this.config.canvasDataHeight,
            fromCenter: false,
            mousemove: function (layer) {
                var objX = { opacity: 1, x: 100, y: layer.eventY };
                var objY = { opacity: 1, x: layer.eventX, y: 0 };
                if (layer.name === "深\n度") {
                    objX.opacity = 0;
                    objY.opacity = 0;
                }
                //让area_line直线跟随鼠标
                $(this).animateLayer('area_line_x', objX, 0);
                $(this).animateLayer('area_line_y', objY, 0);
                //$(this).drawRect({
                //    strokeStyle: '#000',
                //    strokeWidth: 2,
                //    layer: true,
                //    name: name,
                //    draggable: false,
                //    x: layer.x * 1.2, y: layer.eventY * 0.8,
                //    width: layer.width*0.5,
                //    height: 50,
                //    fromCenter: false,
                //})
            }
        })
        ;
        if (name != "深\n度" && name != "荧\n光\n级\n别") {
            this.dataCanvas.drawRect({
                strokeStyle: 'red',
                strokeWidth: 2,
                layer: true,
                name: 'pointRect_' + i,
                //draggable: false,
                opacity: 0,
                x: rectX, y: 100,
                width: arr[i].width * 0.8,
                height: 50,
                fromCenter: false,
            }).drawText({
                fillStyle: 'blue',
                x: 100, y: 175,
                name: 'pointText_' + i,
                fontSize: 18,
                opacity: 0,
                layer: true,
                text: "111",
                fontFamily: '宋体',
                //restrictDragToAxis: 'x'
            });
        }

        this.drawLines(this.dataCanvas, name, "Y", 10);
        this.drawLines(this.dataCanvas, name, "X", Math.floor(this.config.canvasDataHeight / 100));
        this.drawLines(this.dataCanvas, name, "Depth", Math.floor(this.config.canvasDataHeight / 100));
        // this.drawLines(this.dataCanvas, name, "Area", 2);
        //this.drawDataLines(this.dataCanvas, name);


    }
    this.dataCanvas.drawLine({
        strokeStyle: 'black',
        strokeWidth: 1,
        rounded: true,
        layer: true,
        name: "area_line_x",
        x1: 0, y1: 0,
        x2: rectX + 50, y2: 0,
        mousemove: function (layer) {
            var objX = { opacity: 1, x: 100, y: layer.eventY };
            var objY = { opacity: 1, x: layer.eventX, y: 0 };
            if (layer.name === "深\n度") {
                objX.opacity = 0;
                objY.opacity = 0;
            }
            //让area_line直线跟随鼠标
            $(this).animateLayer('area_line_x', objX, 0);
            $(this).animateLayer('area_line_y', objY, 0);



            var pointRectX = 105;
            for (var j = 0; j < arr.length; j++) {
                if (j != 0) {
                    pointRectX += arr[j - 1].width;
                } else {
                    pointRectX = 105;
                }
                $(this).animateLayer('pointRect_' + j, { opacity: 1, x: pointRectX, y: layer.eventY }, 0);
                var text = "值：" + (pointRectX - 100) + " \n " + "MD:" + layer.eventY.toFixed(2);
                $(this).animateLayer('pointText_' + j, { opacity: 1, text: text, x: pointRectX + 40, y: layer.eventY + 20 }, 0);
            }

        }
    });
    this.dataCanvas.drawLine({
        strokeStyle: 'black',
        strokeWidth: 1,
        rounded: true,
        layer: true,
        name: "area_line_y",
        x1: 0, y1: 0,
        x2: 0, y2: this.config.canvasDataHeight,
        mousemove: function (layer) {
            var objX = { opacity: 1, x: 100, y: layer.eventY };
            var objY = { opacity: 1, x: layer.eventX, y: 0 };
            if (layer.name === "深\n度") {
                objX.opacity = 0;
                objY.opacity = 0;
            }
            //让area_line直线跟随鼠标
            $(this).animateLayer('area_line_x', objX, 0);
            $(this).animateLayer('area_line_y', objY, 0);



            var pointRectX = 105;
            for (var j = 0; j < arr.length; j++) {
                if (j != 0) {
                    pointRectX += arr[j - 1].width;
                } else {
                    pointRectX = 105;
                }
                $(this).animateLayer('pointRect_' + j, { opacity: 1, x: pointRectX, y: layer.eventY }, 0);
                var text = "值：" + (pointRectX - 100) + " \n " + "MD:" + layer.eventY.toFixed(2);
                $(this).animateLayer('pointText_' + j, { opacity: 1, text: text, x: pointRectX + 40, y: layer.eventY + 20 }, 0);
            }

        }

    });
}

HLBDCurveObj.prototype.getData=function(name)
{
        
    var dataArry = new Array();
    switch (name) {
        case "深\n度":
            break;
        case "荧\n光\n级\n别":
            break;
        case "电阻率":
            var jsonStr = "";
            


            if (efreshCount == 1)
            {
                jsonStr = '{"getlogdataresult":"0","outcurvenames":{"string":["indexval","DMEA","TQA"]},"valuearray":{"arrayofstring":[{"string":["1936.24","1936.49","1936.75","1937.01","1937.25","1937.50","1937.75","1938","1938.26","1938.50","1938.75","1938.99","1939.24","1939.49","1939.74","1940","1940.25","1940.50","1940.75","1941","1941.25","1941.50","1941.74","1942","1942.25","1942.50","1942.75","1943","1943.25","1943.50","1943.75","1944","1944.25","1944.50","1944.75","1945","1945.25","1945.50","1945.75","1945.99","1946.25","1946.48","1946.75","1947","1947.25","1947.49","1947.75","1947.99","1948.25","1948.50","1948.75","1949","1949.24","1949.50","1949.75","1950","1950.25","1950.50","1950.75","1951","1951.25","1951.50","1951.76","1951.99","1952.25","1952.50","1952.74","1953","1953.25","1953.50","1953.75","1954","1954.25","1954.50","1954.74","1955","1955.25","1955.50","1955.75","1956.01","1956.25","1956.50","1956.74","1956.93","1957.25","1957.49","1957.75","1958","1958.25","1958.51","1958.74","1959","1959.25","1959.49","1959.75","1960","1960.25","1960.28","1960.49","1960.75"]},{"string":["1936.24","1936.49","1936.75","1937.01","1937.25","1937.50","1937.75","1938.00","1938.26","1938.50","1938.75","1938.99","1939.24","1939.49","1939.74","1940.00","1940.25","1940.50","1940.75","1941.00","1941.25","1941.50","1941.74","1942.00","1942.25","1942.50","1942.75","1943.00","1943.25","1943.50","1943.75","1944.00","1944.25","1944.50","1944.75","1945.00","1945.25","1945.50","1945.75","1945.99","1946.25","1946.48","1946.75","1947.00","1947.25","1947.49","1947.75","1947.99","1948.25","1948.50","1948.75","1949.00","1949.24","1949.50","1949.75","1950.00","1950.25","1950.50","1950.75","1951.00","1951.25","1951.50","1951.76","1951.99","1952.25","1952.50","1952.74","1953.00","1953.25","1953.50","1953.75","1954.00","1954.25","1954.50","1954.74","1955.00","1955.25","1955.50","1955.75","1956.01","1956.25","1956.50","1956.74","1956.93","1957.25","1957.49","1957.75","1958.00","1958.25","1958.51"]},{"string":["3.34","2.30","3.25","3.26","2.91","3.81","2.78","3.44","3.49","4.20","4.96","3.33","3.76","4.73","4.27","4.53","4.73","4.30","4.57","4.30","4.20","3.58","4.13","3.50","3.96","4.60","4.15","4.72","4.05","4.71","3.98","4.74","4.59","4.35","4.92","4.60","4.57","4.80","4.75","4.71","4.84","4.43","4.21","4.55","4.24","3.84","3.91","4.80","4.54","4.29","4.74","3.23","3.98","3.88","3.93","4.04","3.41","3.41","4.36","4.14","3.67","4.20","2.59","3.08","4.06","3.87","4.19","4.08","4.09","4.47","3.53","4.89","4.78","4.96","4.91","5.16","3.93","4.73","4.48","4.60","4.52","5.18","4.56","4.17","4.06","4.74","4.21","6.18","5.87","7.22","8.07","6.86","7.06","6.51","4.81","4.49","4.99","4.31","4.17","4.83"]}]},"msg":""}';
            }
            if (efreshCount == 2)
            {
                jsonStr = '{"getlogdataresult":"0","outcurvenames":{"string":["indexval","DMEA","TQA"]},"valuearray":{"arrayofstring":[{"string":["1961","1961.25","1961.50","1961.75","1962","1962.25","1962.50","1962.75","1963","1963.28","1963.49","1963.74","1963.99","1964.25","1964.50","1964.76","1965","1965.25","1965.50","1965.75","1965.98","1966.25","1966.49","1966.74","1967","1967.25","1967.50","1967.75","1968","1968.25","1968.50","1968.75","1969","1969.24","1969.50","1969.75","1970.01","1970.25","1970.50","1970.75","1971","1971.22","1971.49","1971.74","1971.99","1972.12","1972.25","1972.50","1972.75","1973","1973.25","1973.50","1973.74","1974","1974.25","1974.50","1974.75","1975","1975.25","1975.50","1975.75","1976","1976.24","1976.50","1976.75","1977","1977.25","1977.49","1977.75","1978","1978.25","1978.50","1978.75","1978.99","1979.25","1979.50","1979.76","1980","1980.25","1980.50","1980.75","1981.01","1981.25","1981.50","1981.75","1982","1982.25","1982.50","1982.75","1983","1983.25","1983.49","1983.75","1984","1984.25","1984.50","1984.75","1985","1985.25","1985.50"]},{"string":["1958.74","1959.00","1959.25","1959.49","1959.75","1960.00","1960.25","1960.28","1960.49","1960.75","1961.00","1961.25","1961.50","1961.75","1962.00","1962.25","1962.50","1962.75","1963.00","1963.28","1963.49","1963.74","1963.99","1964.25","1964.50","1964.76","1965.00","1965.25","1965.50","1965.75","1965.98","1966.25","1966.49","1966.74","1967.00","1967.25","1967.50","1967.75","1968.00","1968.25","1968.50","1968.75","1969.00","1969.24","1969.50","1969.75","1970.01","1970.25","1970.50","1970.75","1971.00","1971.22","1971.49","1971.74","1971.99","1972.12","1972.25","1972.50","1972.75","1973.00","1973.25","1973.50","1973.74","1974.00","1974.25","1974.50","1974.75","1975.00","1975.25","1975.50","1975.75","1976.00","1976.24","1976.50","1976.75","1977.00","1977.25","1977.49","1977.75","1978.00","1978.25","1978.50","1978.75","1978.99","1979.25","1979.50","1979.76","1980.00","1980.25","1980.50","1980.75","1981.01","1981.25","1981.50","1981.75","1982.00","1982.25","1982.50","1982.75","1983.00"]},{"string":["5.03","5.08","4.62","5.07","5.52","4.67","4.48","4.90","6.56","5.71","4.82","6.39","6.09","5.51","5.80","3.73","4.70","5.11","4.79","4.85","4.74","4.61","5.01","5.18","5.20","5.07","4.42","5.37","5.64","4.94","4.70","5.69","4.68","4.85","4.61","5.29","5.19","6.07","5.56","5.95","5.78","4.92","6.21","7.65","7.62","4.60","3.31","4.83","5.53","4.54","5.43","4.92","5.64","4.81","5.48","5.02","5.42","4.48","4.89","4.88","4.01","4.21","4.40","5.55","5.39","4.90","5.18","4.36","5.45","4.36","5.05","5.78","5.38","4.69","4.51","4.65","5.87","5.38","5.03","4.88","5.86","6.94","5.61","4.36","4.68","5.15","4.85","6.81","6.82","6.77","5.99","6.75","6.15","6.38","6.02","5.25","5.03","5.31","2.44","5.22"]}]},"msg":""}';
            }
            if (efreshCount == 3)
            {
                jsonStr = '{"getlogdataresult":"0","outcurvenames":{"string":["indexval","DMEA","TQA"]},"valuearray":{"arrayofstring":[{"string":["1985.75","1985.99","1986.25","1986.44","1986.75","1987","1987.25","1987.50","1987.75","1988","1988.24","1988.46","1988.74","1989","1989.25","1989.50","1989.74","1990","1990.25","1990.50","1990.75","1991","1991.24","1991.50","1991.75","1991.99","1992.24","1992.50","1992.74","1993","1993.25","1993.50","1993.75","1994","1994.25","1994.49","1994.74","1995","1995.25","1995.50","1995.75","1996","1996.25","1996.50","1996.75","1997","1997.24","1997.50","1997.75","1998","1998.25","1998.50","1998.75","1999","1999.25","1999.50","1999.74","2000","2000.25","2000.50","2000.75","2001","2001.24","2001.50","2001.75","2002","2002.25","2002.49","2002.75","2003","2003.25","2003.49","2003.74","2004","2004.25","2004.50","2004.74","2004.99","2005.25","2005.50","2005.76","2006","2006.25","2006.50","2006.75","2006.99","2007.25","2007.50","2007.75","2008","2008.24","2008.49","2008.75","2009","2009.25","2009.30","2009.50","2009.75","2010","2010.25","2010.50","2010.75","2011","2011.25","2011.50","2011.75","2012","2012.25","2012.50","2012.75","2013","2013.25","2013.50","2013.75","2014","2014.25","2014.50","2014.75","2015.01","2015.25","2015.50","2015.75","2016","2016.24","2016.50","2016.75","2017.01","2017.25","2017.43","2017.48","2017.75","2018","2018.26","2018.50","2018.74","2019.01","2019.25","2019.49","2019.75","2020","2020.24","2020.49","2020.76","2021","2021.25","2021.50","2021.75","2022","2022.24","2022.50","2022.73","2022.99","2023.26","2023.51","2023.75","2024","2024.25","2024.51","2024.75","2025.01","2025.24","2025.51","2025.74","2026.01","2026.25","2026.50","2026.75","2027","2027.25","2027.50","2027.75","2027.99","2028.24","2028.50","2028.75","2029","2029.25","2029.50","2029.75","2030","2030.24","2030.50","2030.75","2031","2031.25","2031.50","2031.76","2032","2032.25","2032.50","2032.75","2032.99","2033.25","2033.50","2033.75","2034","2034.24","2034.50","2034.75","2035","2035.25","2035.50"]},{"string":["1983.25","1983.49","1983.75","1984.00","1984.25","1984.50","1984.75","1985.00","1985.25","1985.50","1985.75","1985.99","1986.25","1986.44","1986.75","1987.00","1987.25","1987.50","1987.75","1988.00","1988.24","1988.46","1988.74","1989.00","1989.25","1989.50","1989.74","1990.00","1990.25","1990.50","1990.75","1991.00","1991.24","1991.50","1991.75","1991.99","1992.24","1992.50","1992.74","1993.00","1993.25","1993.50","1993.75","1994.00","1994.25","1994.49","1994.74","1995.00","1995.25","1995.50","1995.75","1996.00","1996.25","1996.50","1996.75","1997.00","1997.24","1997.50","1997.75","1998.00","1998.25","1998.50","1998.75","1999.00","1999.25","1999.50","1999.74","2000.00","2000.25","2000.50","2000.75","2001.00","2001.24","2001.50","2001.75","2002.00","2002.25","2002.49","2002.75","2003.00","2003.25","2003.49","2003.74","2004.00","2004.25","2004.50","2004.74","2004.99","2005.25","2005.50","2005.76","2006.00","2006.25","2006.50","2006.75","2006.99","2007.25","2007.50","2007.75","2008.00","2008.24","2008.49","2008.75","2009.00","2009.25","2009.30","2009.50","2009.75","2010.00","2010.25","2010.50","2010.75","2011.00","2011.25","2011.50","2011.75","2012.00","2012.25","2012.50","2012.75","2013.00","2013.25","2013.50","2013.75","2014.00","2014.25","2014.50","2014.75","2015.01","2015.25","2015.50","2015.75","2016.00","2016.24","2016.50","2016.75","2017.01","2017.25","2017.43","2017.48","2017.75","2018.00","2018.26","2018.50","2018.74","2019.01","2019.25","2019.49","2019.75","2020.00","2020.24","2020.49","2020.76","2021.00","2021.25","2021.50","2021.75","2022.00","2022.24","2022.50","2022.73","2022.99","2023.26","2023.51","2023.75","2024.00","2024.25","2024.51","2024.75","2025.01","2025.24","2025.51","2025.74","2026.01","2026.25","2026.50","2026.75","2027.00","2027.25","2027.50","2027.75","2027.99","2028.24","2028.50","2028.75","2029.00","2029.25","2029.50","2029.75","2030.00","2030.24","2030.50","2030.75","2031.00","2031.25","2031.50","2031.76","2032.00","2032.25","2032.50","2032.75","2032.99","2033.25","2033.50","2033.75","2034.00","2034.24","2034.50","2034.75","2035.00","2035.25","2035.50"]},{"string":["4.63","2.44","3.18","2.46","4.97","5.25","3.90","3.72","3.08","3.12","3.42","3.10","3.17","0.29","4.15","3.37","4.23","4.71","3.80","4.66","4.52","5.22","2.73","3.86","5.43","4.40","4.23","4.66","4.64","4.82","5.22","4.79","5.03","5.16","5.25","5.37","4.36","4.97","5.10","5.20","4.14","4.69","4.79","5.05","5.21","4.04","4.63","4.90","5.16","4.59","5.51","5.25","4.98","3.93","4.03","6.16","5.45","3.39","4.02","4.16","3.81","4.63","5.50","4.65","5.05","5.11","3.42","3.78","3.98","4.00","3.80","5.31","4.58","5.10","4.29","5.13","5.38","5.35","5.58","5.18","6.48","5.70","5.90","5.85","5.40","5.99","5.27","4.99","3.74","4.97","4.52","5.72","5.47","4.70","4.57","4.89","4.20","3.93","3.86","3.68","4.83","3.66","3.28","4.06","4.25","4.31","4.15","4.33","3.95","4.58","4.40","3.80","6.10","5.56","4.95","6.04","5.32","4.50","4.16","4.95","4.47","5.13","5.66","5.71","4.47","4.07","5.15","4.46","4.50","0.06","3.63","7.35","5.57","4.76","3.75","3.67","3.90","3.20","3.83","4.14","3.81","4.50","4.42","3.85","4.03","4.93","3.94","3.78","3.85","4.06","5.30","4.58","3.84","4.07","3.82","4.73","3.47","4.09","3.54","4.24","3.97","4.25","3.19","2.99","3.43","5.09","3.44","3.57","3.07","3.60","3.24","4.87","3.47","4.29","3.62","2.73","4.49","4.76","4.83","4.54","5.22","4.88","4.53","3.88","4.66","4.57","5.14","6.21","5.26","5.66","6.21","5.80","4.42","4.53","4.46","4.16","5.13","5.16","4.28","3.90","4.16","4.03"]}]},"msg":""}';
            }
            if (jsonStr === "") return dataArry;
            var jsonObj = $.parseJSON(jsonStr);
            var y = jsonObj.valuearray.arrayofstring[0].string;
            var x = jsonObj.valuearray.arrayofstring[2].string;
            var rate = $("#rate option:selected").val();
            var one = new Array();
               
            for (var i = 0; i < y.length; i++) {
                one.push([x[i]*3,(y[i]-this.config.startDepth)*10]);
            }
            var strokeStyle = 'red';
            dataArry.push(new datalineObj(strokeStyle, one, new datalineDesc("FTC", "(m/hr)", 150, 0)));
            break;
        case "钻压/钻速/垂深":
            if (efreshCount != 1) break;
            var one = [
                                [50, 0],
                                [62, 170],
                                [68, 190],
                                [71, 220],
                                [76, 320],
                                [79, 420],
                                [81, 520],
                                [73, 580]
            ];
            var strokeStyle = 'black'
            dataArry.push(new datalineObj(strokeStyle, one,new datalineDesc("ROPA","(m/hr)",150,0)));
            var two = [
                                [70, 0],
                                [73, 150],
                                [76, 170],
                                [85, 190],
                                [88, 220],
                                [79, 320],
                                [90, 420],
                                [84, 520],
                                [85, 580],
                                [86, 584]
            ];
            var strokeStyle = 'red'

            dataArry.push(new datalineObj(strokeStyle, two, new datalineDesc("TVD", "(m)", 150, 0)));          

            break;
        default :

            break;
    }
    return dataArry;
        
}

HLBDCurveObj.prototype.drawDataLines=function () {
    efreshCount++;
    if (efreshCount > 3)
    {
        clearInterval(time);
        return;
    }
    var maxPoint = 0;
    for (var j = 0; j < HLBD.rectArray.length; j++) {

        var name = HLBD.rectArray[j].text;
        var layer = HLBD.dataCanvas.getLayer(name);
        var lineArr = HLBD.getData(name);
        
        for (var k = 0; k < lineArr.length; k++) {
            var obj = {
                strokeStyle: lineArr[k].strokeStyle,
               layer: true,
               strokeWidth: 1,
                Zindex:99999999
                //rounded: true
            };
          
            for (var p = 0; p < lineArr[k].points.length; p += 1) {
                obj['x' + (p + 1)] = parseFloat(layer.x) + parseFloat(lineArr[k].points[p][0]);
                obj['y' + (p + 1)] = lineArr[k].points[p][1];
                if(maxPoint <lineArr[k].points[p][1])
                {
                    maxPoint = lineArr[k].points[p][1];
                }
              
            }
            if (maxPoint > HLBD.config.canvasDataHeight) {
                HLBD.clearDataFram();
                HLBD.config.canvasDataHeight = maxPoint + 100;

                HLBD.drawDataFram();
            }
            HLBD.dataCanvas.drawLine(obj);
            

        
        }
        
        
    }
   
        
}

HLBDCurveObj.prototype.drawLines=function (canvas,name, type, count)
{
    var layer = canvas.getLayer(name);
    var oneitemwidth = layer.width / count;
    var oneitemheight = layer.height / count;
    for (var i = 1; i < count ; i++) {
        var pts = [];
        var lineObj = {
            strokeStyle: '#cccccc',
            strokeWidth: 1,
            layer: true,
            name: name + type + i
        };
        switch (type) {
            case "Y":
                //纵轴
                pts.push([layer.x + (oneitemwidth * i) + 0.5, layer.y + 1]);
                pts.push([layer.x + (oneitemwidth * i), layer.y + layer.height - 1]);
                break;
            case "X":
                //横轴
                pts.push([layer.x + 1, layer.y + (oneitemheight * i) + 0.5]);
                pts.push([layer.x + layer.width - 1, layer.y + (oneitemheight * i) + 0.5]);
              
                break;
            case "Depth":
                if (name != '深\n度')
                    return;
                var rate = $("#rate option:selected").val();
                pts.push([layer.x + 1, layer.y + (oneitemheight * i) + 0.5]);
                pts.push([layer.x + 5, layer.y + (oneitemheight * i) + 0.5]);
                lineObj.strokeStyle = "black";
                canvas
                    .drawLine({
                        strokeStyle: 'black',
                        strokeWidth: 1,
                        layer: true,
                        name:name + type + "right" + i,
                        x1: layer.x + layer.width - 6, y1: layer.y + (oneitemheight * i) + 0.5,
                        x2: layer.x + layer.width - 1, y2: layer.y + (oneitemheight * i) + 0.5,
                    }).drawText({
                        fillStyle: 'black',
                        layer: true,
                        name: name + type + "text" + i,
                        x: layer.x + 25, y: layer.y + (oneitemheight * i),
                        fontSize: 12,
                        text: 1936 + i*10,
                        fontFamily: '宋体'
                    });
                break;
                //case "Area":
                //    pts.push([0, 0.5]);
                //    pts.push([layer.width, 0.5]);
                //    lineObj.strokeStyle = 'red';
                //    lineObj.opacity = 0;
                //    lineObj.name = 'area_line';
              
                //    break;
        }
        for (var p = 0; p < pts.length; p += 1) {
            lineObj['x' + (p + 1)] = pts[p][0];
            lineObj['y' + (p + 1)] = pts[p][1];
        }
        canvas.drawLine(lineObj);
            
    }
}




