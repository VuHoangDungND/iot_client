import { useEffect } from 'react';

import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import React, { useState } from 'react';
import axios from 'axios';

const signalR = require('@microsoft/signalr');
const cx = classNames.bind(styles);

function SideBar({ listDetail, setListDetail }) {
    const [selectedDevices, setSelectedDevices] = useState([]);

    const [listDevice, setListDevice] = useState([]);

    useEffect(() => {
        const getDevice = async () => {
            const res = await axios.get(`${process.env.REACT_APP_BE_API}/Device`);
            setListDevice(res.data);
        };
        getDevice();
    }, []);

    const handleChangeDevice = (item) => {
        const isSelected = selectedDevices.includes(item);

        if (isSelected) {
            setSelectedDevices(selectedDevices.filter((selectedItem) => selectedItem !== item));
            const list = listDetail.filter((selectedItem) => selectedItem.deviceId !== item);
            setListDetail(list);
            leaveChannel(item);
        } else {
            setSelectedDevices([...selectedDevices, item]);
            joinChannel(item);
        }
    };

    let connection = new signalR.HubConnectionBuilder()
        .withUrl(`http://gps-iot.somee.com/current-location`, {
            withCredentials: false,
        })
        .build();

    const joinChannel = (deviceId) => {
        connection
            .start()
            .then(() => {
                console.log(`connected ${deviceId}`);

                connection.invoke('JoinChannel', deviceId).catch((err) => console.log(err));
            })
            .catch((error) => {
                console.error(`SignalR connection failed: ${error}`);
            });
    };

    connection.on('ReceiveMessage', (data) => {
        console.log(data);
        if (selectedDevices.includes(data.deviceId)) {
            const list = listDetail.filter((item) => item.deviceId !== data.deviceId);
            setListDetail([...list, data]);
        } else {
            setListDetail([...listDetail, data]);
        }
    });

    const leaveChannel = async (deviceId) => {
        if (connection.state === signalR.HubConnectionState.Connected) {
            // Ngừng gửi dữ liệu
            connection.invoke('LeaveChannel', deviceId);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div>
                {listDevice.map((item, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={index}
                            checked={selectedDevices.includes(item.deviceId)}
                            onChange={() => handleChangeDevice(item.deviceId)}
                        />
                        <label htmlFor={item.deviceId}>{item.deviceId}</label>
                    </div>
                ))}
            </div>

            <div>
                <h4>Selected Device:</h4>
                <ul>
                    {selectedDevices.map((selectedItem) => (
                        <li key={selectedItem}>{selectedItem}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SideBar;
