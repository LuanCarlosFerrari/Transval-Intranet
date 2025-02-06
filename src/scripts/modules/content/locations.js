export function initLocationsSection() {
    const locations = [
        'Rinópolis-SP', 'Rondonópolis-MT', 'Sumaré-SP', 'Miritituba-PA',
        'Barcarena-PA', 'Santarém-PA', 'Paragominas-PA', 'Colinas do Tocantins-TO',
        'Balsas-MA', 'São Luís-MA', 'Vilhena-RO', 'Uberaba-MG', 'Araxá-MG',
        'Uberlândia-MG', 'Jataí-GO', 'Rio Verde-GO', 'Itumbiara-GO', 'Dourados-MS',
        'Campo Grande-MS', 'Maracaju-MS', 'Ourinhos-SP', 'Assis-SP', 'Paranaguá-PR',
        'Arapoti-PR', 'Londrina-PR', 'Imbituba-SC', 'São Francisco do Sul-SC'
    ].sort();

    const selectOptions = locations.map(location => 
        `<option value="${location}">${location}</option>`
    ).join('');

    const mapHtml = `
        <div class="unidades-container">
            <h2 class="company-title">Conheça Nossas Unidades</h2>
            <select id="unidades-select" class="unidades-select">
                <option value="">Selecione uma unidade</option>
                ${selectOptions}
            </select>
            <div id="map" style="width: 100%; height: 500px;"></div>
        </div>
    `;

    // Return HTML and initialize map after render
    setTimeout(() => initMap(), 100);
    return mapHtml;
}

// Initialize Google Map and markers
function initMap() {
    const locationCoordinates = [
        { lat: -21.235, lng: -50.838, title: 'Rinópolis-SP' },
        { lat: -16.467, lng: -54.635, title: 'Rondonópolis-MT' },
        { lat: -22.820, lng: -47.267, title: 'Sumaré-SP' },
        { lat: -4.290566, lng: -55.952761, title: 'Miritituba-PA' },
        { lat: -1.514722, lng: -48.619722, title: 'Barcarena-PA' },
        { lat: -2.442722, lng: -54.709389, title: 'Santarém-PA' },
        { lat: -2.998056, lng: -47.353333, title: 'Paragominas-PA' },
        { lat: -8.058611, lng: -48.478333, title: 'Colinas do Tocantins-TO' },
        { lat: -7.532222, lng: -46.036944, title: 'Balsas-MA' },
        { lat: -2.529722, lng: -44.296667, title: 'São Luís-MA' },
        { lat: -12.746111, lng: -60.129722, title: 'Vilhena-RO' },
        { lat: -19.748889, lng: -47.936944, title: 'Uberaba-MG' },
        { lat: -19.590833, lng: -46.940833, title: 'Araxá-MG' },
        { lat: -18.916667, lng: -48.283333, title: 'Uberlândia-MG' },
        { lat: -17.878611, lng: -51.720833, title: 'Jataí-GO' },
        { lat: -17.798889, lng: -50.921944, title: 'Rio Verde-GO' },
        { lat: -18.419444, lng: -49.215278, title: 'Itumbiara-GO' },
        { lat: -22.220833, lng: -54.805833, title: 'Dourados-MS' },
        { lat: -20.469722, lng: -54.620833, title: 'Campo Grande-MS' },
        { lat: -21.613889, lng: -55.168889, title: 'Maracaju-MS' },
        { lat: -22.978889, lng: -49.870833, title: 'Ourinhos-SP' },
        { lat: -22.661944, lng: -50.418889, title: 'Assis-SP' },
        { lat: -25.517778, lng: -48.509444, title: 'Paranaguá-PR' },
        { lat: -24.145833, lng: -49.945833, title: 'Arapoti-PR' },
        { lat: -23.311944, lng: -51.159722, title: 'Londrina-PR' },
        { lat: -28.228889, lng: -48.665278, title: 'Imbituba-SC' },
        { lat: -26.242778, lng: -48.638333, title: 'São Francisco do Sul-SC' }
    ];

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: { lat: -15.793889, lng: -47.882778 }, // Centered in Brazil
        styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }]
    });

    const markers = createMarkers(locationCoordinates, map);

    const select = document.getElementById('unidades-select');
    if (select) {
        select.addEventListener('change', handleSelectChange);
    }

    // Add InfoWindows for markers
    const infoWindows = createInfoWindows(locationCoordinates, markers, map);

    // Add marker cluster
    const markerCluster = new MarkerClusterer(map, Object.values(markers), {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });

    // Add custom controls
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
        createCustomControl('Centralizar Mapa', () => {
            map.setCenter({ lat: -15.793889, lng: -47.882778 });
            map.setZoom(4);
        })
    );

    // Add region filters
    addRegionFilters();
}

// Create markers for each location
function createMarkers(locations, map) {
    const markers = {};
    locations.forEach(location => {
        markers[location.title] = new google.maps.Marker({
            position: location,
            map: map,
            title: location.title,
            animation: google.maps.Animation.DROP
        });
    });
    return markers;
}

// Handle location selection change
function handleSelectChange(e) {
    const selectedLocation = e.target.value;
    const marker = markers[selectedLocation];
    if (marker) {
        map.setZoom(12);
        map.setCenter(marker.getPosition());
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
            marker.setAnimation(null);
        }, 1500);
    }
}

// Create InfoWindows for each marker
function createInfoWindows(locations, markers, map) {
    const infoWindows = {};
    locations.forEach(location => {
        const content = `
            <div class="map-marker-info">
                <h3>${location.title}</h3>
                <p>Clique para mais informações</p>
            </div>
        `;
        
        const infoWindow = new google.maps.InfoWindow({
            content: content
        });

        markers[location.title].addListener('click', () => {
            // Close all other InfoWindows
            Object.values(infoWindows).forEach(iw => iw.close());
            infoWindow.open(map, markers[location.title]);
        });

        infoWindows[location.title] = infoWindow;
    });
    return infoWindows;
}

// Create custom control button
function createCustomControl(text, onClick) {
    const controlButton = document.createElement('button');
    controlButton.style.cssText = `
        background-color: white;
        border: 2px solid #ccc;
        border-radius: 3px;
        box-shadow: 0 2px 6px rgba(0,0,0,.3);
        cursor: pointer;
        margin: 10px;
        padding: 8px;
        text-align: center;
    `;
    controlButton.textContent = text;
    controlButton.addEventListener('click', onClick);
    return controlButton;
}

// Add region filter buttons
function addRegionFilters() {
    const regions = {
        'all': 'Todas as Regiões',
        'north': 'Norte',
        'northeast': 'Nordeste',
        'midwest': 'Centro-Oeste',
        'southeast': 'Sudeste',
        'south': 'Sul'
    };

    const filterContainer = document.createElement('div');
    filterContainer.className = 'region-filters';
    
    Object.entries(regions).forEach(([key, value]) => {
        const button = document.createElement('button');
        button.className = 'region-filter-btn';
        button.textContent = value;
        button.onclick = () => filterMarkersByRegion(key);
        filterContainer.appendChild(button);
    });

    document.querySelector('.unidades-container').insertBefore(
        filterContainer,
        document.querySelector('#map')
    );
}

// Filter markers by region
function filterMarkersByRegion(region) {
    Object.entries(markers).forEach(([title, marker]) => {
        const visible = region === 'all' || getMarkerRegion(title) === region;
        marker.setVisible(visible);
    });
}