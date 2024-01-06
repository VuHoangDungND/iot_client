import { useEffect } from 'react';

import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import React, { useState } from 'react';
import axios from 'axios';
import mqtt from 'mqtt';

const cx = classNames.bind(styles);

function SideBar({ listDetail, setListDetail }) {
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [listDevice, setListDevice] = useState([]);
    const [mqttConnections, setMqttConnections] = useState([]);
    var options = {
        username: 'marvelboy',
        password: 'Qqqqqqq1',
    };

    useEffect(() => {
        const getDevice = async () => {
            const res = await axios.get(`${process.env.REACT_APP_BE_API}/Device`);
            setListDevice(res.data);
        };
        getDevice();
        return () => {
            // Đóng tất cả các kết nối
            mqttConnections.forEach((client) => client.end());
        };
    }, []);

    const handleChangeDevice = (item) => {
        const isSelected = selectedDevices.includes(item);

        if (isSelected) {
            setSelectedDevices(selectedDevices.filter((selectedItem) => selectedItem !== item));
            const list = listDetail.filter((selectedItem) => selectedItem.deviceId !== item);
            setListDetail(list);
            leaveTopic(item);
        } else {
            setSelectedDevices([...selectedDevices, item]);
            joinTopic(item);
        }
    };

    const joinTopic = (deviceId) => {
        const client = mqtt.connect('wss://fca1150a13fd455eb1d37dadd06e203e.s2.eu.hivemq.cloud:8884/mqtt', options);

        // Lắng nghe sự kiện khi kết nối thành công
        client.on('connect', () => {
            console.log(`Connected to MQTT broker for topic: ${deviceId}`);
            // Đăng ký để nhận các tin nhắn từ topic cụ thể
            client.subscribe(`device/${deviceId}`);
        });

        // Lắng nghe sự kiện khi nhận được tin nhắn
        client.on('message', (topic, message) => {
            const byteArray = Array.from(message);
            const jsonString = String.fromCharCode(...byteArray);
            const data = JSON.parse(jsonString);
            console.log(data);
            if (selectedDevices.includes(data.deviceId)) {
                const list = listDetail.filter((item) => item.deviceId !== data.deviceId);
                setListDetail([...list, data]);
            } else {
                setListDetail([...listDetail, data]);
            }
        });

        // Lắng nghe sự kiện khi kết nối bị đóng
        client.on('close', () => {
            console.log(`Connection closed for topic: ${deviceId}`);
        });

        const listConnections = mqttConnections.filter((item) => item.deviceId !== deviceId);
        setMqttConnections([...listConnections, { deviceId: deviceId, client: client }]);
    };

    // connection.on('ReceiveMessage', (data) => {
    //     console.log(data);
    //     if (selectedDevices.includes(data.deviceId)) {
    //         const list = listDetail.filter((item) => item.deviceId !== data.deviceId);
    //         setListDetail([...list, data]);
    //     } else {
    //         setListDetail([...listDetail, data]);
    //     }
    // });

    const leaveTopic = async (deviceId) => {
        const removeClient = mqttConnections.filter((item) => item.deviceId === deviceId);
        removeClient[0].client.end();
        const other = mqttConnections.filter((item) => item.deviceId !== deviceId);
        setMqttConnections(other);
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
                        <label htmlFor={item.deviceLicensePlates}>{item.deviceLicensePlates}</label>
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
