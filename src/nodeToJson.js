function camelCase(str) {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function transformStyle(value) {
    const styles = value.split(';').filter((s) => s);
    return styles
        .reduce((acc, cur) => {
            const [key, value] = cur.split(':');
            acc[camelCase(key)] = value.trim();
            return acc;
        }, {});
}

function transformAttributes(attributes) {
    return Array.from(attributes)
        .reduce((acc, {name, value}) => {
            // change html class to className
            if (name === 'class') {
                name = 'className';
            }
            if (name === 'style') {
                acc[name] = transformStyle(value);
                return acc;
            }
            acc[name] = value;
            return acc;
        }, {});
}

function transform(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return undefined;
    }
    const object = {};
    object.type = node.nodeName.toLowerCase();
    object.props = node.attributes && transformAttributes(node.attributes);
    if (node.childNodes.length) {
        object.children = Array.from(node.childNodes).map(item => {
            if (item.nodeType === Node.TEXT_NODE) {
                return item.textContent;
            }
            return transform(item);
        });
    }
    return object;
}

function nodeToJson(node) {
    const nodes = Array.from(node.childNodes);
    return nodes.map((node) => transform(node)).filter(item => item);
}

module.exports = nodeToJson;
