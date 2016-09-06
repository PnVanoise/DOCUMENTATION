// Objectif : exporter une partie de la carte (fonds carto et objets vectoriels) dans un fichier pdf
// Le code ci-dessous vient d'un environnement AngularJS 1.4
// Les blocs suivants sont à mettre dans les bons fichiers html et js

// <Partie HTML>
// Récupérer et appeler le plugin Leaflet-image et la librairie PDFMake dans votre fichier html
<script src="chemin/leaflet-image/leaflet-image.js"></script>
<script type="text/javascript" src="chemin/pdfmake/pdfmake.js"></script>
<script type="text/javascript" src="chemin/pdfmake/vfs_fonts.js"></script>

// <Partie Javascript>
// Les fonctions export2pdf() et map2cropimage() se trouvent dans un directive AngularJs
// La fonction export2pdf() est appelé sur un bouton dans un fichier html depuis une balise ng-click
// La fonction export2pdf() fait appel à la fonction map2cropimage() en gérant les promise, c'est à dire que l'ouverture du pdf
// contenant l'image ne se fait pas avant que l'image soit constituée des différents tuiles raster et des objets vectoriels et 
// que le rognage de l'image soit fait

var map2cropimage = function () {
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

$scope.export2pdf = function () {
    var deferred = $q.defer();
    // var promise = createcanvas.call()
    var promise = exportimg.call();
    promise.then(function() {
        pdfMake.createPdf(docDefinition).open();
    });
}
