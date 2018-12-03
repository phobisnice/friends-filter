module.exports = class {
    constructor(api) {
        this.apiVk = api;
    }

    get user() {
        return this.apiVk.callApi('users.get', { fields: 'photo_100' }).then(([response]) => response);
    }

    get friends() {
        return this.apiVk.callApi('friends.get', { fields: 'first_name, last_name, photo_100' }).then(response => response);
    }
}