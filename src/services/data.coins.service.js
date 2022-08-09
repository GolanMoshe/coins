function CoinService() {
  const GET_ALL_COINS_URL = "https://api.coingecko.com/api/v3/coins/";
  const GET_COIN_BY_ID_URL = "https://api.coingecko.com/api/v3/coins/:coinId";

  let coinsFromCache = undefined;
  function getCoinsFromCache() {
    if(!coinsFromCache) { 
      const coins = storageService.getItem("GET_ALL_COINS_URL");      
      coinsFromCache = coins;
    }
    return coinsFromCache;
  }

  async function getAllCoins({ disableCache = false } = {}) {
    let cachedCoins;

    if (!disableCache)  {
      cachedCoins = getCoinsFromCache();

      if (cachedCoins) {
        console.log(
          "==================fetch coins from CACHE======================"
        );
        return cachedCoins;
      }
    }

    console.log("==================coins from SERVER======================");
    const response = await fetch(GET_ALL_COINS_URL);
    const resultCoins = await response.json();

    const selectCoins = resultCoins.splice(0, Config.COINS_DISPLAY_COUNT);
    const coins = selectCoins.map((coin) => CoinType(coin));

    if(!disableCache) { 
      storageService.setItem("GET_ALL_COINS_URL", JSON.stringify(cachedCoins));
      coinsFromCache = coins;
    }
    return coins;
  }

  async function getCoinById({ coinId }) {
    if (!coinId || !cachedCoins) {
      alert(`coinId and cachedCoins are required!`);
      return;
    }

    const url = GET_COIN_BY_ID_URL.replace(":coinId", coinId);

    const response = await fetch(url);
    const selectedCoin = await response.json();

    const currentPrices = selectedCoin?.market_data?.current_price;
    if (!currentPrices) {
      alert("error no market data available!");
      return;
    }
    const cachedCoin = cachedCoins.find((coin) => coin.id === coinId);
    cachedCoin.currentPrices = CurrentPricesType({ currentPrices });
    cachedCoin.details = CoinDetailsType(selectedCoin);

    console.log("cachedCoin", cachedCoin);
    return cachedCoin;
  }

  function getUserSelectedCoins() {
    return storageService.getItem(Config.USER_SELECTED_COINS_KEY) ?? [];
  }

  async function getCoinsWithUserSelection() { 
    const allCoins = await getAllCoins();
    const userSelectionCoins = await getUserSelectedCoins();

    for (let coin of allCoins) {
      if (userSelectionCoins.includes(coin.id)) {
        coin.isSelected = true;
      }
    }

    return allCoins;
  }

  function clearCache() {
    console.log(
      `=================clean coins from cache=========================`
    );
    coinsFromCache = undefined;
    storageService.removeItem("GET_ALL_COINS_URL");
  }

  async function searchCoins(keyWord){
    
     const coins =(await dataCoinService.getCoinsWithUserSelection()).slice(
      0,
      Config.COINS_DISPLAY_COUNT
    ).filter((coin) => coin.name.toLowerCase().indexOf(keyWord?.toLowerCase()) > -1);

    return coins;
  }

  return {
    searchCoins,
    getAllCoins,
    getCoinById,
    getUserSelectedCoins,
    getCoinsWithUserSelection,
    clearCache,
  };
}

const dataCoinService = CoinService();
