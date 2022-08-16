const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const targetDir = path.resolve(__dirname, '../.')
const exceptRegex = /(\.DS_Store)|(index\.md)|(\.vitepress)|(public)|(.\.vue)/

function resolvePostFiles(scanDir = targetDir, result = []) {
  const files = fs.readdirSync((scanDir = path.resolve(targetDir, scanDir))).filter((fileName) => !exceptRegex.test(fileName))

  files.forEach((file) => {
    const filePath = path.resolve(scanDir, file)
    const fileStat = fs.statSync(filePath)

    if (fileStat.isFile() && file.endsWith('.md')) {
      const matterMd = matter.read(filePath, {
        excerpt: true,
        excerpt_separator: '<!-- more -->'
      })

      const { data } = matterMd
      result.push({
        ...data,
        link: filePath.replace(targetDir, '').replace('.md', '.html'),
        file
      })
    } else if (fileStat.isDirectory()) {
      resolvePostFiles(filePath, result)
    }
  })

  return result
}

fs.writeFileSync(path.resolve(targetDir, './.vitepress/fileData.json'), JSON.stringify(resolvePostFiles(), null, '  '), 'utf-8')
