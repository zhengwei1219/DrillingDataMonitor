
function HLBDCurveObj(headCanvas,dataCanvas) {
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
    this.headCanvas = headCanvas;
    this.dataCanvas = dataCanvas;   
}

HLBDCurveObj.prototype = {
    buildRect: function () {
       //return this.headCanvas;
        var canwidth = $(document).width() - 20;
        var canheight = 400;
        this.headCanvas.attr("width", canwidth);
        this.headCanvas.attr("height", canheight);
        this.headCanvas.drawLine({
            fillStyle: '#ffffff',
            layer: true,
            x1: 0, y1: 0,
            x2: canwidth, y2: 0,
            x3: canwidth, y3: canheight,
            x4: 0, y4: canheight,
            closed: true
        });

        this.dataCanvas.attr("width", canwidth);
        this.dataCanvas.attr("height", 700);

        this.dataCanvas.drawRect({
            fillStyle: '#ffffff',
            layer: true,
            x: 0, y: 0,
            width: canwidth,
            height: 700,
            fromCenter: false
        });



        var rectX = 0;
        var arr = this.rectArray;
        for (var i = 0; i < arr.length; i++) {


            if (i != 0) {
                rectX += arr[i - 1].width;
            } else {
                rectX = 100;
            }
            var textX = rectX + arr[i].width / 2;
            var curve = "curve" + i;
            this.headCanvas.drawRect({
                strokeStyle: '#000',
                strokeWidth: 2,
                layer: true,
                draggable: true,
                x: rectX, y: 100,
                width: arr[i].width,
                height: 300,
                fromCenter: false,
                groups: [curve],
                name: curve,
                dragGroups: [curve],
                restrictDragToAxis: 'x'
            }).drawText({
                fillStyle: 'blue',
                x: textX, y: 175,
                fontSize: 18,
                text: arr[i].text,
                fontFamily: '宋体',
                groups: [curve],
                dragGroups: [curve],
                restrictDragToAxis: 'x'
            })
                .mousedown(function (e) {
                    if (e.which == 3) {  // 1 = 鼠标左键; 2 = 鼠标中键; 3 = 鼠标右键
                        contextmenufun(e);
                    }
                })
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
                draggable: false,
                x: rectX, y: 0,
                width: arr[i].width,
                height: 600,
                fromCenter: false,
                mousemove: function (layer) {
                    //让area_line直线跟随鼠标
                    $(this).animateLayer('area_line', {
                        opacity: 1,
                        x: layer.x, y: layer.eventY
                    }, 0)
                }
            });
            this.drawLines(this.dataCanvas, name, "Y", 10);
            this.drawLines(this.dataCanvas, name, "X", 6);
            this.drawLines(this.dataCanvas, name, "Depth", 6);
            this.drawLines(this.dataCanvas, name, "Area", 2);
            this.drawDataLines(this.dataCanvas,name);


        }
    },
    getData:function(name)
    {
        var dataArry = new Array();
        switch (name) {
            case "深\n度":
                break;
            case "荧\n光\n级\n别":
                break;
            case "电阻率":
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
                var strokeStyle = 'orange'
                dataArry.push(new datalineObj(strokeStyle, one, new datalineDesc("FTC", "(m/hr)", 150, 0)));
                break;
            default :
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
                var three = [
                                    [20, 0],
                                    [23, 150],
                                    [30, 170],
                                    [35, 190],
                                    [37, 220],
                                    [41, 320],
                                    [43, 420],
                                    [52, 520],
                                    [68, 580],
                                    [97, 584]
                ];
                var strokeStyle = 'blue'

                dataArry.push(new datalineObj(strokeStyle, three, new datalineDesc("WOBA", "(KDAN)", 5, 25)));
                break;
        }
        return dataArry;
        
    },
    drawDataLines: function (canvas, name) {
        var layer = canvas.getLayer(name);
        var lineArr = this.getData(name);
        
        for (var i = 0; i < lineArr.length; i++) {
            var obj = {
                strokeStyle: lineArr[i].strokeStyle,
                layer: true,
                strokeWidth:1,
                rounded: true
            };
            for (var p = 0; p < lineArr[i].points.length; p += 1) {
                obj['x' + (p + 1)] = layer.x +　lineArr[i].points[p][0];
                obj['y' + (p + 1)] = lineArr[i].points[p][1];
            }
            canvas.drawLine(obj);
            //头上的数据描述线绘制
            var objhead = {
                strokeStyle: lineArr[i].strokeStyle,
                layer: true,
                strokeWidth: 3,
                rounded: true
            };
            objhead['x1'] = layer.x + 1;
            objhead['y1'] = layer.y + layer.height / 2.5 + 40*i;
            objhead['x2'] = layer.x + layer.width - 1;
            objhead['y2'] = layer.y + layer.height / 2.5 + 40*i;
            this.headCanvas.drawLine(objhead)
            .drawText({
                fillStyle: lineArr[i].strokeStyle,
                layer: true,
                x: objhead['x1'] + layer.width / 2, y: objhead['y1']-10,
                fontSize: 12,
                text: lineArr[i].desc.name,
                fontFamily: '宋体'
            }).drawText({
                fillStyle: lineArr[i].strokeStyle,
                layer: true,
                x: objhead['x1'] + layer.width / 2, y: objhead['y1'] + 10,
                fontSize: 12,
                text: lineArr[i].desc.unit,
                fontFamily: '宋体'
            }).drawText({
                fillStyle: lineArr[i].strokeStyle,
                layer: true,
                x: objhead['x1'] + 10, y: objhead['y1'] + 10,
                fontSize: 12,
                text: lineArr[i].desc.startMark,
                fontFamily: '宋体'
            }).drawText({
                fillStyle: lineArr[i].strokeStyle,
                layer: true,
                x: objhead['x2'] - 10, y: objhead['y2'] + 10,
                fontSize: 12,
                text: lineArr[i].desc.endMark,
                fontFamily: '宋体'
            });

        
        }

        

        
    },
    drawLines: function (canvas,name, type, count)
    {
        var layer = canvas.getLayer(name);
        var oneitemwidth = layer.width / count;
        var oneitemheight = layer.height / count;
        for (var i = 1; i < count ; i++) {
            var pts = [];
            var lineObj = {
                strokeStyle: '#cccccc',
                strokeWidth: 1,
                layer: true
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
                    var rate = $("#rate option:selected").val();;
                    pts.push([layer.x + 1, layer.y + (oneitemheight * i) + 0.5]);
                    pts.push([layer.x + 5, layer.y + (oneitemheight * i) + 0.5]);
                    lineObj.strokeStyle = "black";
                    canvas
                        .drawLine({
                        strokeStyle: 'black',
                        strokeWidth: 1,
                        layer: true,
                        x1: layer.x + layer.width - 6, y1: layer.y + (oneitemheight * i) + 0.5,
                        x2: layer.x + layer.width - 1, y2: layer.y + (oneitemheight * i) + 0.5,
                    }).drawText({
                        fillStyle: 'black',
                        layer: true,
                        x: layer.x + 25, y: layer.y + (oneitemheight * i),
                        fontSize: 12,
                        text: (oneitemheight * i) / 100 * rate,
                        fontFamily: '宋体'
                    });
                    break;
                case "Area":
                    pts.push([0, 0.5]);
                    pts.push([layer.width, 0.5]);
                    lineObj.strokeStyle = 'red';
                    lineObj.opacity = 0;
                    lineObj.name = 'area_line';
              
                    break;
            }
            for (var p = 0; p < pts.length; p += 1) {
                lineObj['x' + (p + 1)] = pts[p][0];
                lineObj['y' + (p + 1)] = pts[p][1];
            }
            canvas.drawLine(lineObj);
            
        }
    }
}



