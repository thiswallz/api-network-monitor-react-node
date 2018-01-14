import React from "react";

const Order = ({sort}) => {
    if(sort=='asc'){
        return (
            <span> &darr;</span>
        );
    }else{
        return (
            <span> &uarr;</span>
        );
    }

};
const OrderLinkItem = ({ name, sort, onOrderData, current }) => {
  return (
    <a href="#" onClick={(evt) => onOrderData(name, evt)}>
        {name} 
        { current==name ? <Order sort={sort} /> : null }
    </a>
  );
};

export default OrderLinkItem;
