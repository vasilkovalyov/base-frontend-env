import '../scss/main.scss'


// jQuery('body').addClass('active')

class Test {
    constructor(options) {
        this.name = options.name
    }

    getName() {
        return this.name
    }
}

const test = new Test({
    name: 'test111'
})
console.log(test.getName())