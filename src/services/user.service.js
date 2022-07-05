function UserService() {
    const userCoins = [];
    function addUser({ profile }) {

    };

    function getProfile() {
        return {};
    }

    function updateProfile({ fName, lName, phone, avatar, email }) {

    };

    function getCoins() {
        return [];
    };

    function addCoin(coinId) {
        const coinsstr = storageService.getItem(Config.USER_COINS_LOCAL_STORAGE_KET) ; 
       
        const userCoins = !!coinsstr ? JSON.parse(coinsstr) : [];

        if (userCoins.includes(coinId)) {
            console.log(`coin already exist in user coins`)
            return
        }

        userCoins.push(coinId);
        storageService.setItem(Config.USER_COINS_LOCAL_STORAGE_KET  ,JSON.stringify(userCoins))
    };

    function removeCoin(coinId) {

    };

    return {
        addUser,
        getProfile,
        updateProfile,
        getCoins,
        addCoin,
        removeCoin,
    };

}

const userService = UserService();

userService.addCoin("bitcoin")