const Model = require('./model');
const View = require('./view');

module.exports = class {
    constructor(api) {
        this.model = new Model(api);
        this.view = new View();

        this.init();
    }

    init() {
        this.actualityData();
        this.dnd(Array.from(document.querySelectorAll('.friends__list')));
        this.addToList();
        this.filterInit();
        this.save();
    }

    dnd(zones) {
        let currentDrag;

        zones.forEach(zone => {
            zone.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/html', 'dragstart');
                currentDrag = { source: zone, node: e.target };
            });

            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            zone.addEventListener('drop', (e) => {
                if (currentDrag) {
                    e.preventDefault();

                    if (e.target.closest('.friends__item')) {
                        zone.insertBefore(currentDrag.node, e.target.closest('.friends__item'));
                    } else {
                        zone.appendChild(currentDrag.node);
                    }

                    this.filterEvent();

                    currentDrag = null;
                }
            });
        })
    }

    addToList() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-btn')) {
                let item = e.target.closest('.friends__item');

                if (item.parentNode === document.querySelector('#oneList')) {
                    item.parentNode.removeChild(item);
                    document.querySelector('.lists-friends__right .friends__list').appendChild(item);
                } else {
                    item.parentNode.removeChild(item);
                    document.querySelector('.lists-friends__left .friends__list').appendChild(item);
                }

                this.filterEvent();

                e.preventDefault();
            }
        })
    }

    filterInit() {
        let searchInputs = Array.from(document.querySelectorAll('.form__search'));
        searchInputs.forEach((input) => {
            input.addEventListener('input', (e) => {
                e.preventDefault();

                let inputValue = input.value.toLowerCase();
                let names = Array.from(input.closest('.friends').querySelectorAll('.friends__item'));
                names.filter((name) => {
                    let nameValue = name.querySelector('.friend__name').textContent.toLowerCase();
                    name.hidden = false;
                    return nameValue.indexOf(inputValue) === -1;
                }).forEach(item => {
                    item.hidden = true;
                })

            })
        })
        
    }

    filterEvent() {
        let inputEvent = new Event('input');
        Array.from(document.querySelectorAll('.form__search')).forEach(input => {
            input.dispatchEvent(inputEvent);
        })
    }

    save() {
        const saveBtn = document.querySelector('#save');
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (window.localStorage) {
                alert('Ваши списки успешно сохранены!');
                let leftSideItems = this.saveData('.lists-friends__left .friends__item', 'friend');
                let rightSideItems = this.saveData('.lists-friends__right .friends__item', 'friend');
                let [user] = this.saveData('.user', 'user');
                
                localStorage.setItem('oneList', JSON.stringify(leftSideItems));
                localStorage.setItem('secondList', JSON.stringify(rightSideItems));
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                alert('К сожелению ваш браузер не поддерживает сохранение');
            }
        })
    }

    saveData(selector, type) {
        let data = Array.from(document.querySelectorAll(selector)).map(item => {
            let user = {};

            if (type === 'friend') {
                user.id = item.querySelector(`.${type}`).dataset.id;
            }

            user.photo_100 = item.querySelector(`.${type}__img`).src;
            [user.first_name, user.last_name] = item.querySelector(`.${type}__name`).textContent.split(' ');

            return user;
        });

        return data;
    }

    async actualityData() {
        let vkList;
        let me;

        try {
            vkList = await this.model.friends;
            me = await this.model.user;
        } catch(e) {
            console.error('Сервер Вконтакте недоступен');
        }

        if (localStorage.getItem('oneList') && localStorage.getItem('secondList')) {
            let storage = this.model.storage;
            let storageList = storage.leftList.concat(storage.rightList).sort((firstItem, secondItem) => firstItem.id - secondItem.id);
            if (vkList) {
                this.compareId(storageList, vkList) ? this.storageInit(storage) : this.renderFriends(vkList, '#oneList');
            } else {
                this.storageInit(storage);
            }

            return;
        }
  
        this.renderUser(me, '#user');
        this.renderFriends(vkList, '#oneList');
    }

    compareId(oneList, secondList) {
        if (oneList.length !== secondList.length) {
            return false;
        }

        for (let i = 0; i < oneList.length; i++) {
            if (+oneList[i].id !== +secondList[i].id) {
                return false;
            }
        }

        return true;
    }

    storageInit(storage) {
        this.renderFriends(storage.leftList, '.lists-friends__left .friends__list');
        this.renderFriends(storage.rightList, '.lists-friends__right .friends__list');
        this.renderUser(storage.user, '#user');
    }

    renderFriends(data, selector) {
        const html = this.view.render('item', data);

        document.querySelector(selector).innerHTML = html;
    }

   renderUser(data, selector) {
        const html = this.view.render('user', data);
        document.querySelector(selector).innerHTML = html;
    }
    
}