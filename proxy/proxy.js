const obj = {
    name: 'hxd',
    age: 26
}

const handle = {
    get (obj, name) {
        return Reflect.get(obj, name)
        // return obj[name]
    },

    set (obj, key, value) {
        console.log('set');
        if (key in obj) {
            Reflect.set(obj, key, value)
            // obj[key] = value
        } else {
            throw new Error('类型不是对象里面的')
        }
    }
}
const proxy = new Proxy(obj, handle)