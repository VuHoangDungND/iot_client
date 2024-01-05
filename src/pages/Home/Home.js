import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useState } from 'react';
import classNames from 'classnames/bind';

import Sidebar from './SideBar';
import styles from './Home.module.scss';

const cx = classNames.bind(styles);

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
            deviceId: 'ABC12',
            driverId: '',
            time: '2024-01-02T16:09:37Z',
            latitude: '21.004495',
            longitude: '105.846476',
            locationInfo: 1,
            satelliteNum: 12,
            speed: 0.94,
            distance: 100,
            status: 3,
        },
    ];

    const [listItem, setListItem] = useState(test);

    const center = {
        lat: parseFloat(test[1].latitude),
        lng: parseFloat(test[1].longitude),
    };

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    if (!isLoaded) {
        return <h2>Loading</h2>;
    }

    return (
        <div className={cx('container')}>
            <Sidebar list={listItem} setList={setListItem} />
            <div className={cx('content')}>
                <GoogleMap
                    center={center}
                    zoom={15}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    options={{ zoomControl: false, streetViewControl: false, fullscreenControl: false }}
                >
                    {listItem.map((item) => (
                        <Marker
                            key={item.deviceId}
                            position={{ lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) }}
                            title={`Marker ${item.deviceId}`}
                        />
                    ))}
                </GoogleMap>
            </div>
        </div>
    );
}

export default Home;
