const Node = function(data, children = []) {
    return {
        data: {
            id: null,
            uri: null,
            open: false,
            renderKey: null,
            image: null,
            name: null,
            ...data
        },
        children
    };
};

export default Node;
