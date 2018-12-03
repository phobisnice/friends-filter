module.exports = class {
    constructor() { }

    render(tempName, model) {
        return require(`../templates/${tempName}.hbs`)(model);
    }
    
}