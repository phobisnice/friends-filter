const Model = require('./model');
const View = require('./view');

module.exports = class {
    constructor(api) {
        this.model = new Model(api);
        this.view = new View();

        this.init();
    }

    init() {
        if (!localStorage.getItem('oneList') && !localStorage.getItem('secondList')) {
            this.friends();
        } else {
            this.storageInit();
        }
        this.user();
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
            localStorage.setItem('oneList', JSON.stringify(document.querySelector('.lists-friends__left .friends__list').innerHTML.trim()))
            localStorage.setItem('secondList', JSON.stringify(document.querySelector('.lists-friends__right .friends__list').innerHTML.trim()))
        })
    }

    storageInit() {
        document.querySelector('.lists-friends__left .friends__list').innerHTML = JSON.parse(localStorage.getItem('oneList'));
        document.querySelector('.lists-friends__right .friends__list').innerHTML = JSON.parse(localStorage.getItem('secondList'));
    }

    async friends() {
        const html = this.view.render('item', await this.model.friends);

        document.querySelector('#oneList').innerHTML = html;
    }

    async user() {
        const html = this.view.render('user', await this.model.user);

        document.querySelector('#user').innerHTML = html;
    }
    
}