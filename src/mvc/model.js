module.exports = class {
    constructor(api) {
        this.apiVk = api;
    }

    get user() {
        return this.apiVk.callApi('users.get', { fields: 'photo_100' }).then(([response]) => response);
    }

    get friends() {
        return this.apiVk.callApi('friends.get', { fields: 'first_name, last_name, photo_100' }).then(response => response.items.sort((firstItem, secondItem) => firstItem.id - secondItem.id));
    }

    get storage() {
        if (localStorage.getItem('oneList') && localStorage.getItem('secondList')) {
            let storage = {};
            storage.leftList = JSON.parse(localStorage.getItem('oneList'));
            storage.rightList = JSON.parse(localStorage.getItem('secondList'));
            storage.user = JSON.parse(localStorage.getItem('user'));
            return storage;
        }; 
    }
}