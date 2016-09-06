**Objectif : exporter une partie de la carte (fonds carto et objets vectoriels) dans un fichier pdf**

- Récupérer et utiliser le plugin ```Leaflet-image``` et la librairie ```PDFMake```

```<script src="chemin/leaflet-image/leaflet-image.js"></script>```

```<script type="text/javascript" src="chemin/pdfmake/pdfmake.js"></script>```

```<script type="text/javascript" src="chemin/pdfmake/vfs_fonts.js"></script>```

  `var canvas2 = document.createElement('canvas');`
  var context = canvas2.getContext('2d');
  // context.fillRect(200,150,50,50);
  var imageObj = new Image();
  imageObj.src = data;
  var sourceX = 640;
  var sourceY = 181;
