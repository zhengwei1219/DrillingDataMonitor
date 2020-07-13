using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DDM.Controllers
{
    public class DataMonitorController : Controller
    {
        //
        // GET: /DataMonitor/

        public ActionResult Curve(string wellno)
        {
            ViewBag.WellNO = wellno;
            return View();
        }
        public ActionResult CurveM(string wellno)
        {
            ViewBag.WellNO = wellno;
            return View();
        }
    }
}
