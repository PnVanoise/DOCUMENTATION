// Objectif : exporter une partie de la carte (fonds carto et objets vectoriels) dans un fichier pdf
// Le code ci-dessous vient d'un environnement AngularJS 1.4 et Leaflet 0.7.7 et avec un fond carto Geoportail
// Les blocs suivants sont à mettre dans les bons fichiers html et js

// ******************** <Partie HTML> ********************
// Gestion des objets vectorielles dans la map en canvas pour la transformation en image
// valable pour Leaflet < v1 (sinon voir doc Leaflet-image)
<script>L_PREFER_CANVAS = true;</script>

// Récupérer et appeler le plugin Leaflet-image et la librairie PDFMake dans le html
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
// par la fonction map2cropimage() une fois l'image constituée
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

// Fonction qui crée une image depuis les tuiles raster et des objets vectoriels de la map courante, et qui rogne l'image
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

// Fonction qui crée le PDF depuis l'objet qui définit sa structure et qui ouvre le PDF dans la navigateur
$scope.export2pdf = function () {
    var deferred = $q.defer();
    var promise = map2cropimage.call(); // appel fonction exportimg en promise
    promise.then(function() {
        pdfMake.createPdf(pdfFileDefinition).open(); // exécution de pdfMake.createPdf quand l'image est constituée
    });
}

// ******************** <Concernant la gestion des objets vectorielles par Leaflet-image> ********************
// Dans cet exemple, les données (géométrie et attributs) viennent du coté serveur sous la forme d'un geojson.
// Chaque géométrie est gérée par Leaflet dans un layer depuis la fonction L.GeoJSON.geometryToLayer() qui constitue un layerGroup (ensemble objets d'une couche métier).
// Grâce à L_PREFER_CANVAS = true, Leaflet-image gère parfaitement les linestring, les polygons et les markers avec les attributs graphiques associés.
// Par contre les objets ponctuels personnalisés posent des problèmes = je n'ai pas réussi à gérer les L.awesome-markers.
// Je les ai remplacés par des L.Marker basés sur des L.icon en spécifiant obligatoirement les attributs IconSize et iconAnchor (sinon erreurs dans console navigateur 'Cannot read property 0 of undefined')
var myIcon = L.icon({
    iconUrl: 'chemin_icon/nom_icon.png',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
});

//  ******************** CONCLUSION ********************
// Le code est perfectible surtout pour la partie promise et dans l'utilisation des canvas pour la constitution de l'image
// Ci-dessous un exemple sans appel serveur = copier du code dans un fichier, récupérer un icone 14x14 et les librairies dans <head>

<!DOCTYPE html>
<html>
  <head>
    <title>Export PDF example</title>
    
    <script>L_PREFER_CANVAS = true;</script>
    <script src="../js/lib/leaflet/leaflet-src.js"></script>
    <link rel="stylesheet" href="../js/lib/leaflet/leaflet.css">
    
    
    <script src="leaflet-image/leaflet-image.js"></script>
    <script type="text/javascript" src="../js/lib/pdfmake/pdfmake.js"></script>
    <script type="text/javascript" src="../js/lib/pdfmake/vfs_fonts.js"></script>
    
  </head>
  <body>
    <div id="map" style="width: 400px; height: 300px"></div>
    <br>
    <input type="button" value="Génération image et PDF" onClick="export2img2pdf()"/>
    <div id="images"></div>
    
    <script>
      var map = L.map('map').setView([45.5,6], 10);
      url = 'https://gpp3-wxs.ign.fr/CLE_GEOPORTAIL/geoportail/wmts?LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS&EXCEPTIONS=text/xml&FORMAT=image/jpeg&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}';

      // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      L.tileLayer(url, {
      }).addTo(map);

      // Ajout circle
      var circle = L.circle([45.5,6], 2000, {
          color: 'blue',
          fillColor: '#f03',
          fillOpacity: 0.5
      // }).addTo(map);
      });

      // Ajout marker
      L.marker([45.5,6.1]).addTo(map);
      
      // Ajout geojson
      var geojsonFeature = {
          "type": "Feature",
          "properties": {
              "id": "10",
              "name": "Son nom",
              "comments": "Bla bla bla"
          },
          "geometry": {
              // "type": "Point",
              // "coordinates": [6,45.5]
              // "type": "LineString",
              // "coordinates": [[6,45.5],[6.1,45.5],[6,45.4]]
              "type": "Polygon",
              "coordinates": [[[6,45.5],[6.1,45.5],[6.1,45.4],[6,45.4],[6,45.5]]]
              
          }
      };

      // Ajout d'un marker perso
      var myIcon = L.icon({
          iconUrl: 'icon.png', // !! créé un icone de 14x14 !!
          iconSize: [14, 14],
          iconAnchor: [7, 7],
      });
      L.marker([45.5,6], {icon: myIcon}).addTo(map);

      // Feature group
      var json = L.GeoJSON.geometryToLayer(geojsonFeature);
      L.featureGroup([json]).addTo(map);

      // var export2img2pdf = function () {
      //   leafletImage(map, function(err, canvas) {
      //       var img = document.createElement('img');
      //       var dimensions = map.getSize();
      //       img.width = dimensions.x;
      //       img.height = dimensions.y;
      //       img.src = canvas.toDataURL();
      //       document.getElementById('images').innerHTML = '';
      //       document.getElementById('images').appendChild(img);
      //       docDefinition.content[0].image = canvas.toDataURL("image/png");
      //       pdfMake.createPdf(docDefinition).open();
      //   });
      // }

      var export2img2pdf = function () {
        console.log('dans export2img2pdf');
        var sizemap = map.getSize();
        leafletImage(map, function(err, canvas) {
            var itemImage = canvas.toDataURL('image/jpeg');
            var finalCanvas = document.createElement('canvas');
            finalCanvas.width = 200;
            finalCanvas.height = 150;
            var context = finalCanvas.getContext('2d');
            var imageObj = new Image();
            imageObj.src = itemImage;
            var sourceWidth = 200;
            var sourceHeight = 150;
            var sourceX = sizemap.x / 2 - sourceWidth / 2;
            var sourceY = sizemap.y / 2 - sourceHeight / 2;
            context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
            var imgfin = new Image();
            imgfin.src = finalCanvas.toDataURL("image/png");
            document.getElementById('images').innerHTML = '';
            document.getElementById('images').appendChild(imgfin);
            pdfFileDefinition.content[0].image = finalCanvas.toDataURL("image/png");
            pdfMake.createPdf(pdfFileDefinition).open();
        });
      }

      var pdfFileDefinition = {
      content: [
        {
            image: '',
        },
        {
        text: 'Bla bla bla bla bla'
        }
      ],
      styles: {
        header: {
          bold: true,
          color: '#000',
          fontSize: 11
        }
      }
    };
    </script>
  </body>
</html>
