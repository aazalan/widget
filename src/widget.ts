import { App, AsyncComponentLoader } from "vue";
import uniqid from "uniqid"

export class Widget {
    constructor(
        private amoWidget: any
    ) {}

    private modalApp: App
    private uniqID = uniqid(`modal-`)

    onRender() {
        console.log('render from widget');
    }

    async openModal(leadsIDs: number[]) {

        if (this.modalApp) this.modalApp.unmount()

        document.querySelector('#widgets_block').remove()
        let div = document.querySelector(`${this.uniqID}`)
        if (!div) {
            div = document.createElement('div')
            div.id = this.uniqID
            document.querySelector('#page_holder').appendChild(div)
        }

        this.modalApp = await this.createApp(() => import('./components/Modal.vue'), { leadsIDs })
        this.modalApp.mount(div)
    }

    private async createApp (component: AsyncComponentLoader, props?: any) {
        const { createApp, defineAsyncComponent } = await import('vue')
        return createApp(defineAsyncComponent(component), props)
    }
}