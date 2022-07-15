function StorageService() {

    const localStorage = window.localStorage

    function getItem(key) {
        const value = localStorage.getItem(key);

        return (value && value !== 'undefined') ? JSON.parse(value) : null;
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


