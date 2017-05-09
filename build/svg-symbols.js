// 这是一个 Node.js 脚本，并没有被 webpack 打包，所以我们不能使用 import path from 'path'
  const path = require('path') // 路径工具
  const fs = require('fs') // 文件系统工具

  var svgFolder = path.join(__dirname, '../static/svg_icons/')
  var jsPath = path.join(__dirname, '../src/assets/icons.js')

  var svgFiles = fs.readdirSync(svgFolder) // [ 'add.svg', 'book.svg', 'cup.svg', 'heart.svg', 'id.svg', 'phone.svg', 'work.svg' ]

  var symbols = svgFiles.map(function (filename) {
      var absolutePath = path.join(svgFolder, filename)
        var fileContent = fs.readFileSync(absolutePath).toString('utf8')
        var name = path.basename(filename, '.svg')
        return fileContent
          .replace(/<\?.+?\?>/g, '') // 去掉 <?xml version="1.0" standalone="no"?>
        .replace(/<!.+?>/g, '') // 去掉 <!DOCTYPE svg PUBLIC ...>
        .replace(/version=".+?"/g, '')
        .replace(/xmlns=".+?"/g, '')
        .replace(/class=".+?"/g, '')
        .replace(/fill=".+?"/g, '')
        .replace(/stroke=".+?"/g, '')
        .replace(/<svg /, `<svg id="icon-${name}" `)
        .replace(/\bsvg\b/g, 'symbol') // 改 svg 为 symbol
        .replace(/\s{2,}/g, ' ')
    }).join('\n')

  var js = `export default \`<svg style="display:none">\n${symbols}\n</svg>\`\n`

  fs.writeFileSync(jsPath, js, {flag: 'w'})
