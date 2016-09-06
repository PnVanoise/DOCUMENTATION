// Objectif : exporter une partie de la carte (fonds carto et objets vectoriels) dans un fichier pdf
// Le code ci-dessous vient d'un environnement AngularJS 1.4 et Leaflet
// Les blocs suivants sont à mettre dans les bons fichiers html et js

// ******************** <Partie HTML> ********************
// Gestion des objets vectorielles dans la map en canvas pour la transformation en image
// valable pour Leaflet < v1 (sinon voir doc Leaflet-image)
<script>L_PREFER_CANVAS = true;</script>

// Récupérer et appeler le plugin Leaflet-image et la librairie PDFMake dans votre fichier html
<script src="chemin/leaflet-image/leaflet-image.js"></script> // https://github.com/mapbox/leaflet-image
<script type="text/javascript" src="chemin/pdfmake/pdfmake.js"></script> // http://pdfmake.org/#/
<script type="text/javascript" src="chemin/pdfmake/vfs_fonts.js"></script>

// ******************** <Partie Javascript> ********************
// Les fonctions export2pdf() et map2cropimage() se trouvent dans un directive AngularJs
// La fonction export2pdf() est appelé sur un bouton dans un fichier html depuis une balise ng-click
// La fonction export2pdf() fait appel à la fonction map2cropimage() en gérant les promise, c'est à dire que l'ouverture du pdf
// contenant l'image ne se fait pas avant que l'image soit constituée des différents tuiles raster et des objets vectoriels et 
// que le rognage de l'image soit fait

// Structure qui sera utilisé par PDFMake pour construire le fichier PDF dans la fonction export2pdf()
// Pour l'exemple, le seul bloc important est image:'' dans content = initialisation d'un objet image vide qui sera rempli
// par la fonction map2cropimage() une fois l'image constitué
var pdfFileDefinition = {
    content: [
        {
            image: '',
        },
        {
            text: 'Fruits and Calories'
        }
    ],
    styles: {
        header: {
            bold: true,
            contentolor: '#000',
            fontSize: 11
        },
        // Autres propriétés
    }
}

// Fonction qui crée une image depuis les tuiles raster et des objets vectoriels de la map courante rognage de l'image
var map2cropimage = function () {
    var deferred = $q.defer(); // gestion promise pour assurer constitution complète image
    var map = mapService.getMap(); // Récupération objet map (ici map se trouve dans un service AngularJs mapService)
    var sizemap = map.getSize();
    leafletImage(map, function(err, canvas) { // plugin pour la création de l'image depuis la map
        var itemImage = canvas.toDataURL('image/jpeg');
        var finalCanvas = document.createElement('canvas');
        
        // taille du canvas qui permet de créer l'image finale = détermine la taille de l'image finale
        finalCanvas.width = 400;
        finalCanvas.height = 300;
        
        var context = finalCanvas.getContext('2d');
        var imageObj = new Image();
        imageObj.src = itemImage;
        
        // taille du morceau de la map qu'on souhaite récupérer (taille map = 1680x660)
        // todo : partie à rendre dynamique selon la taille de la map afin d'avoir des proportions plutôt que des constantes
        var sourceWidth = 400;
        var sourceHeight = 300;
        // coordonnées à partir desquelles le morceau de map est récupéré
        // pour cet example une image de 400x300 centrée sur la map est récupérée
        var sourceX = sizemap.x / 2 - sourceWidth / 2;
        var sourceY = sizemap.y / 2 - sourceHeight / 2;
        
        // création de l'image depuis le canvas
        context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
        var imgfin = new Image();
        
        // bloc permettant de faire afficher l'image pour tester
        // créer <div id="images"></div> dans html
        // imgfin.src = canvas2.toDataURL("image/png");
        // document.getElementById('images').innerHTML = '';
        // document.getElementById('images').appendChild(imgfin);
        
        // Insertion de l'image dans l'objet qui va constituer le PDF
        pdfFileDefinition.content[0].image = finalCanvas.toDataURL("image/png");
        
        deferred.resolve();
    });
    return deferred.promise;
}

$scope.export2pdf = function () {
    var deferred = $q.defer();
    // var promise = createcanvas.call()
    var promise = exportimg.call();
    promise.then(function() {
        pdfMake.createPdf(pdfFileDefinition).open();
    });
}
