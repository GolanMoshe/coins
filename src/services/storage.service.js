function StorageService() {

    const localStorage = window.localStorage

    function getItem(key) {
        return localStorage.getItem(key);
    };

    function setItem(key, value) {
        localStorage.setItem(key, value)
    };

    function removeItem(key) {
        localStorage.removeItem(key)
    };

    function updateItem(key, value) {
        if (isItemExist(key)){
            setItem(key,value)
        }
    };

    function isItemExist(key){
        return !!getItem(key)
    }

    return {
        getItem,
        setItem,
        removeItem,
        updateItem,
    };

}

const storageService = StorageService();


