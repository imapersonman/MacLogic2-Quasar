import { boot } from 'quasar/wrappers'
import VueRx from 'vue-rx'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(( { app } ) => {
  // something to do
  app.use(VueRx)
})
