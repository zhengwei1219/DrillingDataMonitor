function BaseCurve(headCanvas, dataCanvas) {
    this.headCanvas = headCanvas;
    this.dataCanvas = dataCanvas;
    this.config = {
        canvasHeadHeight: 400,
        canvasHeadWidth: $(document).width() - 20,
        canvasDataHeight: 700,
        canvasDataWidth: $(document).width() - 20,
        efreshTime: 1000,
        startDepth: 1936
    };
}

BaseCurve.prototype = {
    buildRect: function () {


        this.drawHeadFram();
        this.drawDataFram();

        this.startIntervval();


    }
}
