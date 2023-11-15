window.onload = function() {
    
    L.mapquest.key = KEY;
    L.mapquest.geocoding().geocode(`${listingLocation},${listingCountry}`, createMap);

    function createMap(error, response) {
        var location = response.results[0].locations[0];
        var latLng = location.displayLatLng;
        var map = L.mapquest.map('map', {
          center: latLng,
          layers: L.mapquest.tileLayer('map'),
          zoom: 12
        });
        
        var customPopup = L.popup({ closeButton: false })
            .setLatLng(latLng)
            .setContent('<strong>' + listingTitle + '</strong> <br> Exact location will be provided after booking')
            .openOn(map);
    };

    // var map = L.mapquest.map('map', {
    //     center: [28.0229 , 73.3119],
    //     layers: L.mapquest.tileLayer('map'),
    //     zoom: 9
    // });
    // map.addControl(L.mapquest.control());
}