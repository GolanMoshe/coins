function StorageService() {

    const localStorage = window.localStorage

    function getItem(key) {
        const value = localStorage.getItem(key);
        let parseValue;
        try{
            parseValue =  JSON.parse(value) ;
            return parseValue
        }catch(err){
           
        }

        return (value && value !== 'undefined') ? value : null;
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


