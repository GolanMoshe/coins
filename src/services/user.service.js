function UserService() {
    const userCoins = [];

    function addUser(user) {
        if (!user)
            throw (`user is mandatory`);
        storageService.setItem(Config.USER_PROFILE_KEY, JSON.stringify(user))
    };

    function getUser() {
        return storageService.getItem(Config.USER_PROFILE_KEY);
    }

    function updateUser({ fName, lName, phone, avatar, email }) {

    };

    function getCoins() {
        return [];
    };

    function isPremium(){
        const user = userService.getUser();
        return !!user.isPremium;
    }

    function toggleCoinSelection({ coinId, isChecked }) {
       
        const userSelectionCoins = dataCoinService.getUserSelectedCoins();
        let isAddCoinEnabled = true;

        if (isChecked && userSelectionCoins.length > 4 && !isPremium()) {
            isAddCoinEnabled = false;
        }

        if (!isAddCoinEnabled) {
            alert("For premuim users only, you can't select more then 5 coins");
            return !isChecked;
        }

        isChecked ? addUserSelectedCoin(coinId) : removeUserSelectedCoin(coinId);
        return isChecked;
    }

    function addUserSelectedCoin(coinId) {

        const userSelectionCoins = dataCoinService.getUserSelectedCoins();
        if (userSelectionCoins.includes(coinId)) {
            console.log(`coin already exist in user coins`)
            return
        }
        userSelectionCoins.push(coinId);

        storageService.setItem(Config.USER_SELECTED_COINS_KEY, JSON.stringify(userSelectionCoins))
    };

    function removeUserSelectedCoin(coinId) {

        const userSelectionCoins = dataCoinService.getUserSelectedCoins();
        console.log("userSelectionCoins", userSelectionCoins);
        const coinIdIndex = userSelectionCoins.indexOf(coinId);
        console.log("coinIdIndex", coinIdIndex);
        if (coinIdIndex > -1) {
            userSelectionCoins.splice(coinIdIndex, 1);
            console.log("userSelectionCoins", userSelectionCoins);
        }

        storageService.setItem(Config.USER_SELECTED_COINS_KEY, JSON.stringify(userSelectionCoins))

    };

    return {
        addUser,
        getUser,
        updateUser,
        toggleCoinSelection,
        getCoins,
        isPremium,
    };

}

const userService = UserService();

