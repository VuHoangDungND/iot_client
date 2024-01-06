import classNames from 'classnames/bind';
import styles from './SideBarHis.module.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const cx = classNames.bind(styles);

function SideBarHis({ setListPoly, setCenter }) {
    const [selectedDevice, setSelectedDevice] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState([]);
    const [listDevice, setListDevice] = useState([]);
    const [listTrip, setListTrip] = useState([]);
    const [time, setTime] = useState(moment().format('YYYY-MM-DD'));

    useEffect(() => {
        const getDevice = async () => {
            const res = await axios.get(`${process.env.REACT_APP_BE_API}/Device`);
            setListDevice(res.data);
        };
        getDevice();
    }, []);

    useEffect(() => {
        const getTrip = async (deviceId, time) => {
            const res = await axios.get(`${process.env.REACT_APP_BE_API}/Gps`, { params: { deviceId, time } });
            setListTrip(res.data.data);
        };
        if (selectedDevice.length > 0) getTrip(selectedDevice[0], time);
    }, [selectedDevice, time]);

    useEffect(() => {
        const getPoly = async (deviceId, start, end) => {
            const res = await axios.get(`${process.env.REACT_APP_BE_API}/Gps/trip`, {
                params: { deviceId, start, end },
            });
            setListPoly(res.data);
            if (res.data.length > 0)
                setCenter({ lat: parseFloat(res.data[0].latitude), lng: parseFloat(res.data[0].longitude) });
        };
        if (selectedTrip.length > 0) getPoly(selectedDevice[0], selectedTrip[0].item1.time, selectedTrip[0].item2.time);
    }, [selectedTrip]);

    const handleChangeDevice = (item) => {
        const isSelected = selectedDevice.includes(item);

        setListTrip([]);

        if (isSelected) {
            setSelectedDevice([]);
        } else {
            setSelectedDevice([item]);
        }
    };

    const handleChangeTrip = (item) => {
        const isSelected = selectedTrip.includes(item);
        setListPoly([]);
        if (isSelected) {
            setSelectedTrip([]);
        } else {
            setSelectedTrip([item]);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div>
                <label htmlFor="timeInput">Chọn thời gian:</label>
                <input
                    type="date"
                    id="dateInput"
                    name="dateInput"
                    value={time}
                    onChange={(e) => {
                        setTime(e.target.value);
                    }}
                />
            </div>
            <div>
                {listDevice.map((item, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={index}
                            checked={selectedDevice.includes(item.deviceId)}
                            onChange={() => handleChangeDevice(item.deviceId)}
                        />
                        <label htmlFor={item.deviceLicensePlates}>{item.deviceLicensePlates}</label>
                    </div>
                ))}
            </div>

            <div>
                <h4>List Trip:</h4>
                {listTrip.map((item, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={index}
                            checked={selectedTrip.includes(item)}
                            onChange={() => handleChangeTrip(item)}
                        />
                        <label htmlFor={item.deviceId}>Trip {index}</label>
                    </div>
                ))}
            </div>

            <div>
                <h4>Device Selected:</h4>
                <ul>
                    {selectedDevice.map((selectedItem) => (
                        <li key={selectedItem}>{selectedItem}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SideBarHis;
