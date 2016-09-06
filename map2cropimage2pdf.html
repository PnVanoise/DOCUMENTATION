var exportimg = function () {
    var deferred = $q.defer();
    var map = mapService.getMap();
    var sizemap = map.getSize();
    console.log('size map : '+sizemap);
    window.map = map;
    leafletImage(map, function(err, canvas) {
        var don = canvas.toDataURL('image/jpeg');
        var canvas2 = document.createElement('canvas');
        canvas2.width = 400;
        canvas2.height = 300;
        window.canvas2=canvas2;
        var context = canvas2.getContext('2d');
        var imageObj = new Image();
        imageObj.src = don;
        var sourceWidth = 400;
        var sourceHeight = 300;
        var sourceX = sizemap.x / 2 - sourceWidth / 2;
        var sourceY = sizemap.y / 2 - sourceHeight / 2;;
        context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
        var imgfin = new Image();
        // imgfin.src = canvas2.toDataURL("image/png");
        // document.getElementById('images').innerHTML = '';
        // document.getElementById('images').appendChild(imgfin);
        docDefinition.content[0].image = canvas2.toDataURL("image/png");
        deferred.resolve();
    });
    return deferred.promise;
}

$scope.shootmaptest = function () {
    var deferred = $q.defer();
    // var promise = createcanvas.call()
    var promise = exportimg.call();
    promise.then(function() {
        pdfMake.createPdf(docDefinition).open();
    });
}
