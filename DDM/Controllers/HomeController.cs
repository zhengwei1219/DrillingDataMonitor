using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DDM.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "修改此模板以快速启动你的 ASP.NET MVC 应用程序。";

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "你的应用程序说明页。";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "你的联系方式页。";

            return View();
        }
        public ActionResult WellList()
        {
            //通过webService获取活动井列表
            try
            {
                object result = WebServiceHelper.InvokeWebService("http://192.168.1.123/wds/WitsmlService.asmx", "GetActiveWellInfo", null);
                ViewBag.WellList = result as string[][];
            }
            catch (Exception ex)
            {
                throw new Exception("数据接口异常，原因：" + ex.Message);
            }
               
            return View();
        }
        public ActionResult loading()
        {

            return View();
        }
    }
}
