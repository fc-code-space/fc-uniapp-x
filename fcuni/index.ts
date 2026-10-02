// 20261001
import { Store } from './store'
import { useFcSystemStore } from './store/system'
import { Router } from './router'
import { FCTypeRouterConfig } from '@/modules/router'
// import { i18n } from './i18n'
// import { localMessages } from '@/modules/i18n'
// import { Theme } from './theme'
// import { Request } from './network/request'
// import { Upload } from './network/upload'
// import { Download } from './network/download'
// import { Stream } from './network/stream'
// import WebSocket from './network/websocket'
// import { Privacy } from './privacy'
// import { Permission } from './permission'
// import { Tool } from './tool'
// import { UniPush } from './push/uni'
// import { uniPushConfig } from '@/modules/push/uni'
// import { Update } from './update'

function install(app : VueApp) {
	app.use(Store)
	// app.use(i18n.init(localMessages))
	Router.init(FCTypeRouterConfig)
	// UniPush.init(uniPushConfig)
}

export const FC = {
	install,
	Router,
	useFcSystemStore,
	Store,
	// i18n,
	// Theme,
	// Request,
	// Upload,
	// Download,
	// Stream,
	// WebSocket,
	// Privacy,
	// Permission,
	// Tool,
	// UniPush,
	// Update,
}
