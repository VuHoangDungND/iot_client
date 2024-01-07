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
        const arrowPath = [];

        for (let i = 0; i < listPoly.length; i++) {
            const path = {
                lat: parseFloat(listPoly[i].latitude),
                lng: parseFloat(listPoly[i].longitude),
            };
            arrowPath.push(path);
        }

        const polylines = (
            <Polyline
                path={arrowPath}
                options={{
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    icons: [
                        {
                            icon: {
                                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            },
                            offset: '50%',
                            repeat: '100px',
                            fillColor: 'blue',
                        },
                    ],
                }}
            />
        );

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
                    mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '16px' }}
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
