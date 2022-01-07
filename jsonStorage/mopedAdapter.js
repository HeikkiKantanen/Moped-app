'use strict';

function adapt(item) {
    console.log('mopedAdapter');
    return Object.assign(item, {
        id: +item.id,
        modelYear: +item.modelYear,
        itemsInStock: +item.itemsInStock,
        topSpeed: +item.topSpeed
    });
}

module.exports = { adapt }