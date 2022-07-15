function CoinService() {
  const GET_ALL_COINS_URL = "https://api.coingecko.com/api/v3/coins/list";
  const GET_COIN_BY_ID_URL = "https://api.coingecko.com/api/v3/coins/:coinId";
 


  function getCoinsFromCache() { 
    return storageService.getItem('GET_ALL_COINS_URL') ?? null;
  }

  async function getAllCoins({ disableCache = false } = {}) {

    let cachedCoins;
    
    if (!disableCache) { 
      cachedCoins = getCoinsFromCache();
      
      if (cachedCoins) {
        console.log( '==================fetch coins from CACHE======================');
        return cachedCoins;
      }
    }

  
  

    console.log( '==================coins from SERVER======================')
    const response = await fetch(GET_ALL_COINS_URL);
    const coins = await response.json();

    const selectCoins = coins.splice(0, Config.COINS_DISPLAY_COUNT);
    cachedCoins = selectCoins.map((coin) => CoinType(coin));

    storageService.setItem("GET_ALL_COINS_URL" , JSON.stringify(cachedCoins));
    
    return cachedCoins;

  };


  async function getCoinById({ coinId }) {
    if (!coinId || !cachedCoins) {
      alert(`coinId and cachedCoins are required!`);
      return;
    };

    const url = GET_COIN_BY_ID_URL.replace(":coinId", coinId);

    const response = await fetch(url);
    const selectedCoin = await response.json();

    const currentPrices = selectedCoin?.market_data?.current_price;
    if (!currentPrices) {
      alert('error no market data available!')
      return;
    }
    const cachedCoin = cachedCoins.find((coin) => coin.id === coinId);
    cachedCoin.currentPrices = CurrentPricesType({ currentPrices });
    cachedCoin.details = CoinDetailsType(selectedCoin);


    console.log("cachedCoin", cachedCoin);
    return cachedCoin;

  }

   function getUserSelectedCoins(){
    return storageService.getItem(Config.USER_SELECTED_COINS_KEY) ?? [];
  }

  async function getCoinsWithUserSelection(){
    const allCoins =  await getAllCoins();
    const userSelectionCoins =  await getUserSelectedCoins();


    for (let coin of allCoins){

      if(userSelectionCoins.includes(coin.id)){
        coin.isSelected = true;
      }

    }

    return allCoins;

  }


  function clearCache() { 
    console.log(`=================clean coins from cache=========================`);
    storageService.removeItem('GET_ALL_COINS_URL');
  }
  


  return {
    getAllCoins,
    getCoinById,
    getUserSelectedCoins,
    getCoinsWithUserSelection,
    clearCache
  };
}

const dataCoinService = CoinService();
