module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        productName: 'Ray',
        mac: {
          icon: './ray_icon.png'
        },
        win: {
          icon: './ray_icon.png'
        }
      }
    }
  }
}
