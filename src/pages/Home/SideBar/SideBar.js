import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import React, { useState } from 'react';

const cx = classNames.bind(styles);

function Sidebar(list, setList) {
    const [selectedItems, setSelectedItems] = useState([]);

    console.log(list);
    const handleCheckboxChange = (item) => {
        const isSelected = selectedItems.includes(item);

        if (isSelected) {
            setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div>
                {list.map((item, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={index}
                            checked={selectedItems.includes(item.deviceId)}
                            onChange={() => handleCheckboxChange(item.deviceId)}
                        />
                        <label htmlFor={item}>{item}</label>
                    </div>
                ))}
            </div>

            <div>
                <h4>Selected Items:</h4>
                <ul>
                    {selectedItems.map((selectedItem) => (
                        <li key={selectedItem}>{selectedItem}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
