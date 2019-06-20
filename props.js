module.exports = {
  text: {
    type: 'input',
    label: '文本',
    value: '默认文案'
  },
  align: {
    type: 'select',
    label: '排列',
    value: 'left',
    options: [
      { label: '左', value: 'left' },
      { label: '中', value: 'center' },
      { label: '右', value: 'right' }
    ]
  }
}
