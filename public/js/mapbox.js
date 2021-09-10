export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidHJ1bmdodDE4MTAiLCJhIjoiY2tzd3l3ZjFmMTdyMDJ5czI2Z2tqc2tudCJ9.HQjSNP6cDA_wEH4COoqAnQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/trunght1810/ckswzf44z7lbl17qik4uc8cs5',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false,
  });
  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //Create MArker
    const el = document.createElement('div');
    el.className = 'marker';
    //Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`)
      .addTo(map);
    //Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
