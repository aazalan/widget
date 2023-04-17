import { Widget } from "./widget";

export default function (amoWidget) {
  let widget: Widget

  const getWidget = async () => {
    if (process.env.NODE_ENV === 'production ') {
      __webpack_public_path__ = `${amoWidget.params.path}/build/`
    }  
    if (!widget) { 
      widget = new Widget(amoWidget);
    }

    return widget
  }

  amoWidget.callbacks = {
        settings () {},
        init () {
            console.log('hello');
          return true;
        },
        bind_actions () {
          return true;
          },
        async render () {
          (await getWidget()).onRender()
          return true;
          },
        dpSettings () {},
        advancedSettings () {},
        destroy () {},
        contacts: {
          selected () {
            console.log(amoWidget.list_selected());
          }
        },
        onSalesbotDesignerSave (handler_code, params) {},
        leads: {
          async selected () {
            const { selected } = amoWidget.list_selected()
            const leads: number[] = selected.map(({id}) => id)
            await (await getWidget()).openModal(leads)
          }
        },
        todo: {
          selected: function () {}
        },
        onSave () {
            return true;
        },
        onAddAsSource (pipeline_id) {}
      };

      return amoWidget;
}
