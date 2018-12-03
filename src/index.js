import "./style.scss";
const VK = require('./modules/api.vk');
const Controller = require('./mvc/controller');

const apiVK = new VK(6770194, 2);
const controller = new Controller(apiVK);