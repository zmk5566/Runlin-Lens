var current_chapter = 0;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

window.onload = function() {

    var img = document.getElementById("img_"+current_chapter);
    //ctx.drawImage(img, 10, 10);
    ctx.drawImage(img, 0, 0, 600, 500);
    update_chapter();
  }; 


  var max_chapter = 54;

  function update_chapter(){
    document.getElementById("text_content").innerHTML = current_chapter;

    // use ajax to get the chapter content using vanilla js
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
             document.getElementById("text_content").innerHTML = this.responseText;

        }
        }
    xhttp.open("GET", "./data/text/"+current_chapter+".txt", true);
    xhttp.send();
  }

  function next_chapter(){
    if (current_chapter < max_chapter){
    current_chapter += 1;

    var img = document.getElementById("img_"+current_chapter);
    //ctx.drawImage(img, 10, 10);
    ctx.drawImage(img, 0, 0, 600, 500);


    deleteMarkers();
    update_chapter();
    load_place_data();
    }
  }

  function load_place_data(){
    // use ajax to get the geo_tags content using vanilla js
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var geo_tags = JSON.parse(this.responseText);
            for (var i = 0; i < geo_tags.length; i++) {
                the_iframe = "<iframe id='"+geo_tags[i].city_name+"' src='"+geo_tags[i].TGAZ_URI+"'></iframe>"
                console.log(the_iframe)

                document.getElementById("text_content").innerHTML = document.getElementById("text_content").innerHTML.replace(geo_tags[i].city_name, "<a href='"+geo_tags[i].TGAZ_URI+"' target='_blank'>"+geo_tags[i].city_name+"</a>");
                addMarker({ lat: geo_tags[i].Y, lng: geo_tags[i].X});
            }
        }
        }
    xhttp.open("GET", "./data/geo_tags/"+current_chapter+".json", true);
    xhttp.send();


  }


  function set_location_marker(input_lat, input_lng){
    
    const myLatLng = { lat: input_lat, lng: input_lng };

    new google.maps.Marker({
       position: myLatLng,
       map,
     });
  }

  function prev_chapter(){
    if (current_chapter > 0){
        current_chapter -= 1;
        deleteMarkers();
        update_chapter();
        load_place_data();
    }
  }


  var map ;
  var markers = [];

  function initMap() {
    const myLatLng = { lat: 30.596069, lng: 114.297691 };
    // set default as satelite view



    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: myLatLng,
    });
  
  }



  function addMarker(position) {
    const marker = new google.maps.Marker({
      position,
      map,
    });
  
    markers.push(marker);
  }
  
  // Sets the map on all markers in the array.
  function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
  
  // Removes the markers from the map, but keeps them in the array.
  function hideMarkers() {
    setMapOnAll(null);
  }
  
  // Shows any markers currently in the array.
  function showMarkers() {
    setMapOnAll(map);
  }
  
  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    hideMarkers();
    markers = [];
  }
  

  
  window.initMap = initMap;