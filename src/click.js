function click(node) {
    try {
        node.dispatchEvent(new MouseEvent('click'))
    } catch (e) {
        const evt = document.createEvent('MouseEvents')
        evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null)
        node.dispatchEvent(evt);
    }
}

module.exports = click;
