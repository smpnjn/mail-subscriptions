const validateEmail = function(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const replaceHTML = function(html, obj) {
    return html.replace(/\{\{(.*?)\}\}/g, function(key) {
        const newData = obj[key.replace(/[{}]+/g, "")];
        return newData || "";
    });
}

export { validateEmail, replaceHTML }