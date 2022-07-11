module.exports = function registerThePlugin(on) {
  on('task', {
    print(s) {
      console.log(s)
      return null
    },
  })
}
