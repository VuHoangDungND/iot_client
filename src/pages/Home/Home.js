import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useState } from 'react';

function Home() {
    const test = [
        {
            deviceId: 'ABC123',
            driverId: '',
            time: '2024-01-02T16:09:25Z',
            latitude: '21.004494',
            longitude: '105.846466',
            locationInfo: 1,
            satelliteNum: 12,
            speed: 0.58,
            distance: 100,
            status: 3,
        },
        {
            deviceId: 'ABC123',
            driverId: '',
            time: '2024-01-02T16:09:37Z',
            latitude: '20.004505',
            longitude: '106.846474',
            locationInfo: 1,
            satelliteNum: 12,
            speed: 0.94,
            distance: 100,
            status: 3,
        },
    ];

    const center = {
        lat: parseFloat(test[0].latitude),
        lng: parseFloat(test[0].longitude),
    };

    const [map, setMap] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    if (!isLoaded) {
        return <h2>Loading</h2>;
    }

    const onLoad = (map) => {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map);
    };

    return (
        <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{ zoomControl: false, streetViewControl: false, fullscreenControl: false }}
            onLoad={onLoad}
        >
            <Marker position={center} />
        </GoogleMap>
    );
}

export default Home;
