var Controlobj;
window.onload = LoadControl;
function LoadControl()
{
    
    
    Controlobj = document.getElementById("Controlobj");
    
    //get Version
    var version = "";
    try {
        version = Controlobj.GetVersion();
    }
    catch (e) {
        $("#dv_curve").html("<h4 class='error' style='color:darkred'>未能正确加载数据监控控件，请点击<a href='../App/WebGS2D.exe'>此处</a>下载并安装</h4>");
        return;
    }
    Controlobj.SetLogServiceUrl("http://192.168.1.123/gds/WitsmlService.asmx");
    Controlobj.SetTemplateServiceUrl("http://192.168.1.123/gds/WitsmlService.asmx");
    Controlobj.SetInterpretUrl("http://192.168.1.123/gds/interpretService.asmx");
    Controlobj.SetIndexType(0);
    Controlobj.ApplyTemplate("9737");
    Controlobj.SetLogInfo("BD31-1-1d", "BD31-1-1d_8.5in", "随钻测井数据");
    Controlobj.SetBottomMargin(20);
    Controlobj.SetDepthInterval(1800, 2100, 0.002, 0);
    Controlobj.SetAutoExtend(true);
    Controlobj.SetAutoScroll(true);
    setTimeout(updateData, 300);

    
}
function updateData()
{
    Controlobj.UpdateLogCurve();
    setTimeout(updateData, 10000);
    
}