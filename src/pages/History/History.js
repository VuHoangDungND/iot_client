import { GoogleMap, useJsApiLoader, Polyline } from '@react-google-maps/api';
import { useState } from 'react';
import classNames from 'classnames/bind';

import SideBarHis from './SideBarHis';
import styles from './History.module.scss';

const cx = classNames.bind(styles);

function History() {
    const [listPoly, setListPoly] = useState([]);

    const [center, setCenter] = useState({
        lat: parseFloat('21.004494'),
        lng: parseFloat('105.846466'),
    });

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    const renderPolylines = () => {
        const polylines = [];

        for (let i = 0; i < listPoly.length - 1; i++) {
            const startPoint = {
                lat: parseFloat(listPoly[i].latitude),
                lng: parseFloat(listPoly[i].longitude),
            };
            const endPoint = {
                lat: parseFloat(listPoly[i + 1].latitude),
                lng: parseFloat(listPoly[i + 1].longitude),
            };

            const polyline = (
                <Polyline
                    key={i}
                    path={[startPoint, endPoint]}
                    options={{
                        strokeColor: '#FF0000',
                        strokeOpacity: 1,
                        strokeWeight: 2,
                    }}
                />
            );

            polylines.push(polyline);
        }

        return polylines;
    };

    if (!isLoaded) {
        return <h2>Loading</h2>;
    }

    return (
        <div className={cx('container')}>
            <SideBarHis setListPoly={setListPoly} setCenter={setCenter} />
            <div className={cx('content')}>
                <GoogleMap
                    center={center}
                    zoom={16}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    options={{
                        zoomControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                        mapTypeControl: false,
                    }}
                >
                    {renderPolylines()}
                </GoogleMap>
            </div>
        </div>
    );
}

export default History;
