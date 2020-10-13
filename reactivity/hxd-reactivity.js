
// 1. 用Proxy监听对象，数据的获取 回触发get函数
// 2. 数据的修改 会触发set函数
// 3. 用map收集所有的依赖
// {
//     target: {
//         key: [effect, effect2]
//     }
// }
// 定义全局的map
let targetMap = new WeakMap()   
// 收集effect的数组
let effectStack = []

// 收集完成
function track (target, key) {
    //  初始化Map
    const effect = effectStack[effectStack.length - 1]

    // 有在执行的effect进行收集
    if (effect) {
        // 需要收集
        let depMap = targetMap.get(target)
        if (depMap === undefined ) {
            depMap = new Map()

            targetMap.set(target, depMap)
        }

        let dep = depMap.get(key)

        if (dep === undefined) {
            dep = new Set()
            depMap.set(key, dep)
        }
        // 完成初始化

        // 下面开始收集effect
        if (!dep.has(effect)) {
            dep.add(effect)
            // 双向缓存 存储
            effect.deps.push(dep)
        }
    }
}

// 执行
function trigger (target, key, info) {
    let depMap = targetMap.get(target)
    if (depMap === undefined) {
        return // 没有effect副作用
    }

    const effects = new Set()
    const computeds = new Set() // 特殊的effect

    if (key) {
        let deps = depMap.get(key)

        deps.forEach(effect => {
            if (effect.computed) {
                computeds.add(effect)
            } else {
                effects.add(effect)
            }
        })
    }
    effects.forEach(effect => effect())
    computeds.forEach(computed => computed())
}

// 触发get 和 set方法 
const baseHanler = {
    get (target, key) {
        const ret = target[key] // 实际中使用 Reflect.get()
    
        // @todo 收集依赖 到全局的map
        track(target, key)
        
        return ret
    },
    
    set (target, key, val) {
        const info = { oldValue: target[key], newValue: val }
        target[key] = val // 实际中使用 Reflect.set()

        // @todo 这里要去拿到收集effect， 执行下
        trigger(target, key, info)
    }
}

// 实现响应式
function reactive (target) {
    const observed = new Proxy(target, baseHanler)
    return observed
}

// 实现计算属性
function computed (fn) {
    const runner = effect(fn, { computed: true, lazy: true })
    return {
        effect: runner,
        get value () {
            return runner()
        }
    }
}

// 实现副作用
function effect (fn, options = {}) {
    let e = createReactiveEffect(fn, options)
    if (!options.lazy) {
        e()
    }
    return e
}

function createReactiveEffect (fn, options) {
    // effect 做扩展
    const effect = function effect(...args) {
        return run(effect, fn, args)
    }
    effect.deps = []
    effect.computed = options.computed
    effect.lazy = options.lazy

    return effect
}

// 真正执行
function run (effect, fn, args) {
    if (effectStack.indexOf(effect) === -1) {
        try {
            effectStack.push(effect)
            return fn(...args)
        } finally {
            effectStack.pop()
        }
    }
}