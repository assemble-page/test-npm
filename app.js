const puppeteer = require('puppeteer')
const AV = require('leancloud-storage')
const fs = require('fs')
const path = require('path')

const pngName = 'screenshot.png'
const COMPONENT = 'Component'

let initObj = null
function init () {
  if (!initObj) {
    AV.init('jK1QXM6LbiJqdpeLG244Gs3g-gzGzoHsz', 'Kj84b69z40Ue9uNFb4WDAUz3')
    initObj = {
      Component: AV.Object.extend(COMPONENT)
    }
  }
  return initObj
}

async function screen (params) {
  const isPort = /^\d+$/.test(params)
  const port = isPort ? params : 8080
  const url = params && !isPort ? params : undefined

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 375,
      height: 677,
      isMobile: true
    }
  })
  const page = await browser.newPage()
  await page.goto(url || `http://localhost:${port}`)
  await page.screenshot({
    path: './' + pngName
  })
  await browser.close()
}

async function isComponentExist (data) {
  await init()
  const query = new AV.Query(COMPONENT)
  query.equalTo('name', data.name)
  return query.find()
}

async function uploadScreen (data) {
  init()
  const file = new AV.File(data.name, fs.createReadStream(path.resolve(__dirname, './screenshot.png')))
  return file.save()
}

async function createComponent (data) {
  const { Component } = init()
  const com = new Component()
  Object.keys(data).forEach(key => {
    com.set(key, data[key])
  })
  return com.save()
}

async function updateComponent (instance, data) {
  const ins = AV.Object.createWithoutData(COMPONENT, instance.id)
  Object.keys(data).forEach(key => {
    ins.set(key, data[key])
  })
  return ins.save()
}

async function run () {
  const { name, version } = require('./package.json')
  const data = {
    name,
    version,
    props: require('./props.js')
    // imgId: undefined,
    // imgUrl: undefined
  }
  if (!fs.existsSync(path.resolve(__dirname, pngName))) {
    console.log('缩略图不存在，截图')
    await screen(process.argv[2])
    console.log('截图成功，上传...')
    const img = await uploadScreen(data)
    data.imgId = img.id
    data.imgUrl = img.attributes.url
    console.log('上传成功')
  }

  console.log('检测组件是否已存在')
  const exist = await isComponentExist(data)
  console.log(exist.length)
  if (exist.length) {
    console.log('组件存在，更新字段')
    await updateComponent(exist[0], data)
    console.log(`更新成功 ${data.name}@${data.version}`)
  } else {
    console.log('组件不存在，新增...')
    await createComponent(data)
    console.log(`新增组件 ${data.name}@${data.version} 成功`)
  }
}

(function () {
  console.log('发布组件到 xnpm')
  require('child_process').exec('xnpm publish', async (err) => {
    if (err) {
      throw err
    }
    await run()
    console.log('组件成功发布')
  })
})()
