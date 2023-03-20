import VueGtag, { trackRouter } from 'vue-gtag-next'
import type { UserModule } from 'valaxy'

export const install: UserModule = ({ isClient, app, router }) => {
  if (isClient) {
    app.use(VueGtag, {
      property: { id: 'G-G7ZRGQGP5K' },
    })

    trackRouter(router)
  }
}
