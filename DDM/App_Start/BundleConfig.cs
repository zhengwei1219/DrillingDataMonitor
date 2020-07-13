using System.Web;
using System.Web.Optimization;

namespace DDM
{
    public class BundleConfig
    {
        // 有关 Bundling 的详细信息，请访问 http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/assets/vendor/jquery/jquery.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                        "~/assets/vendor/bootstrap/js/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/klorofil").Include(
                        "~/assets/scripts/klorofil-common.js"));


            bundles.Add(new StyleBundle("~/Content/css").Include("~/assets/vendor/bootstrap/css/bootstrap.css",
                        "~/assets/vendor/font-awesome/css/font-awesome.css",
                        "~/assets/vendor/linearicons/style.css",
                        "~/assets/css/main.css",
                        "~/assets/css/demo.css"
                        ));

           
        }
    }
}