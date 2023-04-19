export class Widget {

    constructor(private amoWidget: any) {}

    onRender() {
        console.log('render from widget');
    }

    wrapFields() {
        document.querySelectorAll('.linked-form__field__label').forEach((node) => {
            if(!node.classList.contains('linked-form__field__label_disabled') && !node.classList.contains('linked-form__field__label-multiple')) {
                console.log(node)
                node.style.overflowX = 'visible'
                node.style.whiteSpace = 'pre-line'
            }
            
        })
    }
}