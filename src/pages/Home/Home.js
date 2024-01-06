import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import classNames from 'classnames/bind';
import moment from 'moment';

import Sidebar from './SideBar';
import styles from './Home.module.scss';

const cx = classNames.bind(styles);

function Home() {
    const [listDetail, setListDetail] = useState([]);
    const [showInfo, setShowInfo] = useState({ id: '', show: false });

    const center = {
        lat: parseFloat('21.004494'),
        lng: parseFloat('105.846466'),
    };

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    const handleMarkerClick = (deviceId) => {
        if (showInfo.id === deviceId) {
            setShowInfo({ ...showInfo, show: !showInfo.show });
        } else {
            setShowInfo({ id: deviceId, show: true });
        }
    };

    const checkStatus = (status) => {
        switch (status) {
            case 1:
                return 'xe đang di chuyển';
            case 2:
                return 'xe đang dừng';
            case 3:
                return 'xe đỗ';
            default:
                return 'Trạng thái không xác định';
        }
    };

    const checkTime = (time) => {
        const formatTime = moment(time).format('h:mm:ss a DD/MM/YYYY');
        return formatTime;
    };

    if (!isLoaded) {
        return <h2>Loading</h2>;
    }

    return (
        <div className={cx('container')}>
            <Sidebar listDetail={listDetail} setListDetail={setListDetail} />
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
                    {listDetail?.map((item) => (
                        <Marker
                            key={item.deviceId}
                            position={{ lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) }}
                            title={`Marker ${item.deviceId}`}
                            onClick={() => handleMarkerClick(item.deviceId)}
                        >
                            {showInfo.show && showInfo.id === item.deviceId && (
                                <InfoWindow onCloseClick={() => handleMarkerClick(item.deviceId)}>
                                    <div className={cx('info-box')}>
                                        <p>ID thiết bị: {item.deviceId}</p>
                                        <p>Tên thiết bị: {item.deviceName}</p>
                                        <p>ID người lái: {item.driverId}</p>
                                        <p>Tên người lái: {item.driverName}</p>
                                        <p>Trạng thái:{checkStatus(item.status)}</p>
                                        <p>Thời gian: {checkTime(item.time)}</p>
                                    </div>
                                </InfoWindow>
                            )}
                        </Marker>
                    ))}
                </GoogleMap>
            </div>
        </div>
    );
}

export default Home;
