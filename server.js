const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const compilerSfc = require('@vue/compiler-sfc')
const compilerDom = require('@vue/compiler-dom')

const app = new Koa()

//@todo
// 1. 支持npm包的import
//     把 import xx from 'vue' 替换成 import xx from '/@modules/vue'
// Koa监听到modules文件就去 node_modules找
// 2. 支持.vue单文件组件的解析
// .vue文件浏览器不识别， 浏览器import只识别.js
// .vue 替换为 script  template
// template => render函数 拼成一个对象
// script.render = render
// 3. 支持import css

// 替换vue为/@modules.vue
function rewriteImport(content) {
    return content.replace(/ from ['|"]([^'"]+)['|"]/g, function (s0, s1) {
        if (s1[0] !== '.' && s1[1] !== '/') {
            return ` from '/@modules/${s1}'`
        } else {
            return s0
        }
    })
}

app.use((ctx) => {
    const {
        request: { url, query },
    } = ctx
    if (url === '/') {
        // 访问根目录 index.html
        let content = fs.readFileSync('./index.html', 'utf-8')
        content = content.replace(
            '<script',
            `
            <script>
                window.process = {
                    env: {NODE_EV: 'dev'}
                }
            </script>
            <script
        `
        )
        ctx.type = 'text/html'
        ctx.body = content
    } else if (url.endsWith('.css')) {
        console.log(url.slice(1))
        const p = path.resolve(__dirname, url.slice(1))
        const file = fs.readFileSync(p, 'utf-8')

        const content = `
            const css = '${file.replace(/\n/g, '')}'
            const link = document.createElement('style')
            link.setAttribute('type', 'text/css')
            document.head.appendChild(link)
            link.innerHTML = css

            export default css
        `
        ctx.type = 'application/javascript'
        ctx.body = content
    } else if (url.endsWith('.js')) {
        const p = path.resolve(__dirname, url.slice(1))
        ctx.type = 'application/javascript'
        const content = fs.readFileSync(p, 'utf-8')
        ctx.body = rewriteImport(content)
    } else if (url.startsWith('/@modules/')) {
        const prefix = path.resolve(__dirname, 'node_modules', url.replace('/@modules/', ''))
        const modules = require(prefix + '/package.json').module
        const p = path.resolve(prefix, modules)
        const ret = fs.readFileSync(p, 'utf-8')
        ctx.type = 'application/javascript'
        ctx.body = rewriteImport(ret)
    } else if (url.indexOf('.vue')) {
        // 单文件解析
        const p = path.resolve(__dirname, url.split('?')[0].slice(1))
        const { descriptor } = compilerSfc.parse(fs.readFileSync(p, 'utf-8'))

        if (!query.type) {
            ctx.type = 'application/javascript'
            ctx.body = `
${rewriteImport(descriptor.script.content.replace('export default ', 'const __script = '))}
import { render as __render } from '${url}?type=template'
__script.render = __render
export default __script
            `
        } else if (query.type === 'template') {
            const template = descriptor.template
            const render = compilerDom.compile(template.content, { mode: 'module' }).code
            ctx.type = 'application/javascript'
            ctx.body = rewriteImport(render)
        }
    }
})

app.listen(9092, () => {
    console.log('listen 9092')
})
