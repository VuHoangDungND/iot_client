import { useEffect, useState, useRef } from 'react';

import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import axios from 'axios';
import mqtt from 'mqtt';

const cx = classNames.bind(styles);

function SideBar({ listDetail, setListDetail }) {
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [listDevice, setListDevice] = useState([]);
    const [mqttConnections, setMqttConnections] = useState([]);
    const connectionsRef = useRef();
    connectionsRef.current = mqttConnections;

    var options = {
        username: process.env.REACT_APP_USER_NAME,
        password: process.env.REACT_APP_PASSWORD,
    };

    useEffect(() => {
        const getDevice = async () => {
            const res = await axios.get(`${process.env.REACT_APP_BE_API}/Device`);
            setListDevice(res.data);
        };
        getDevice();

        //Xóa tất cả connect khi unmount
        return () => {
            connectionsRef.current.map((item) => item.client.end());
        };
    }, []);

    const handleChangeDevice = (item) => {
        const isSelected = selectedDevices.includes(item);

        if (isSelected) {
            setSelectedDevices(selectedDevices.filter((selectedItem) => selectedItem !== item));
            const list = listDetail.filter((selectedItem) => selectedItem.DeviceId !== item);
            setListDetail(list);
            leaveTopic(item);
        } else {
            setSelectedDevices([...selectedDevices, item]);
            joinTopic(item);
        }
    };

    const joinTopic = (deviceId) => {
        const client = mqtt.connect(process.env.REACT_APP_MQTT_BROKER, options);

        client.on('connect', () => {
            console.log(`Connected to MQTT broker for topic: ${deviceId}`);
            client.subscribe(`device/${deviceId}`);
        });

        // Lắng nghe sự kiện khi nhận được tin nhắn
        client.on('message', (topic, message) => {
            const byteArray = Array.from(message);
            const jsonString = String.fromCharCode(...byteArray);
            const data = JSON.parse(jsonString);
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

    const leaveTopic = (deviceId) => {
        const removeClient = mqttConnections.filter((item) => item.deviceId === deviceId);
        removeClient[0].client.end();
        const other = mqttConnections.filter((item) => item.deviceId !== deviceId);
        setMqttConnections(other);
    };

    return (
        <div className={cx('wrapper')}>
            <div>
                <h4>Các biển số xe theo dõi</h4>
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
        </div>
    );
}

export default SideBar;
