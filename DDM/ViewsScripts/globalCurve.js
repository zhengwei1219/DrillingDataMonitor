function rect(text, width) {
    this.text = text;
    this.width = width
};
function datalineObj(strokeStyle, points, desc) {
    this.strokeStyle = strokeStyle;
    this.points = points;
    this.desc = desc;
}
function datalineDesc(name, unit, startMark, endMark) {
    this.name = name;
    this.unit = unit;
    this.startMark = startMark;
    this.endMark = endMark;
}

function CurveContext()
{
    var company = $("#companyName option:selected").val();
    var head = $('#can_header');
    var data = $('#can_datas');
    this.curve = null;
    switch (company)
    {
        case "哈里波顿":

            this.curve = new HLBDCurveObj(head, data);
            break;
        case "斯伦贝谢":

            this.curve = new SNBXCurveObj(head, data);
            break;
    }
    

}
CurveContext.prototype = {
    buildRect : function()
    {
        this.curve.buildRect();
    }
}










$(document).click(function (e) {
    $("#contextmenu").hide();
});
var getOffset = {
    top: function (obj) {
        return obj.offsetTop + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0)
    },
    left: function (obj) {
        return obj.offsetLeft + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0)
    }
};
var Controlobj;
document.oncontextmenu = function (e) {
    return false;
}

function contextmenufun(e) {
    var oMenu = document.getElementById("contextmenu");
    var aUl = oMenu.getElementsByTagName("ul");
    var aLi = oMenu.getElementsByTagName("li");
    var showTimer = hideTimer = null;
    var i = 0;
    var maxWidth = maxHeight = 0;
    var aDoc = [document.documentElement.offsetWidth, document.documentElement.offsetHeight];
    oMenu.style.display = "none";
    for (i = 0; i < aLi.length; i++) {
        //为含有子菜单的li加上箭头
        aLi[i].getElementsByTagName("ul")[0] && (aLi[i].className = "sub");
        //鼠标移入
        aLi[i].onmouseover = function () {
            var oThis = this;
            var oUl = oThis.getElementsByTagName("ul");
            //鼠标移入样式
            oThis.className += " active";
            //显示子菜单
            if (oUl[0]) {
                clearTimeout(hideTimer);
                showTimer = setTimeout(function () {
                    for (i = 0; i < oThis.parentNode.children.length; i++) {
                        oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
                        (oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
                    }
                    oUl[0].style.display = "block";
                    oUl[0].style.top = oThis.offsetTop + "px";
                    oUl[0].style.left = oThis.offsetWidth + "px";
                    //setWidth(oUl[0]);
                    //最大显示范围
                    maxWidth = aDoc[0] - oUl[0].offsetWidth;
                    maxHeight = aDoc[1] - oUl[0].offsetHeight;
                    //防止溢出
                    maxWidth < getOffset.left(oUl[0]) && (oUl[0].style.left = -oUl[0].clientWidth + "px");
                    maxHeight < getOffset.top(oUl[0]) && (oUl[0].style.top = -oUl[0].clientHeight + oThis.offsetTop + oThis.clientHeight + "px")
                }, 300);
            }
        };
        //鼠标移出
        aLi[i].onmouseout = function () {
            var oThis = this;
            var oUl = oThis.getElementsByTagName("ul");
            //鼠标移出样式
            oThis.className = oThis.className.replace(/\s?active/, "");
            clearTimeout(showTimer);
            hideTimer = setTimeout(function () {
                for (i = 0; i < oThis.parentNode.children.length; i++) {
                    oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
                    (oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
                }
            }, 300);
        };
    }
    oMenu.style.display = "block";
    oMenu.style.top = event.clientY + "px";
    oMenu.style.left = event.clientX + "px";
    //setWidth(aUl[0]);
    //最大显示范围
    maxWidth = aDoc[0] - oMenu.offsetWidth;
    maxHeight = aDoc[1] - oMenu.offsetHeight;
    //防止菜单溢出
    oMenu.offsetTop > maxHeight && (oMenu.style.top = maxHeight + "px");
    oMenu.offsetLeft > maxWidth && (oMenu.style.left = maxWidth + "px");
    return false;
}