function CoinService() {
  const GET_ALL_COINS_URL = "https://api.coingecko.com/api/v3/coins/";
  const GET_COIN_BY_ID_URL = "https://api.coingecko.com/api/v3/coins/:coinId";
  const GET_COINS_PRICES_URL =  "https://min-api.cryptocompare.com/data/pricemulti?fsyms=:coinsSymbols&tsyms=:currency"

  let coinsFromCache = undefined;
  const coinsGraphHistory =[];
  function getCoinsFromCache() {
    return coinsFromCache ? coinsFromCache : storageService.getItem("GET_ALL_COINS_URL")
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
      storageService.setItem("GET_ALL_COINS_URL", JSON.stringify(coins));
      coinsFromCache = coins;
    }
    return coins;
  }

  async function getCoinById({ coinId }) {
    if (!coinId) {
      alert(`coinId and cachedCoins are required!`);
      return;
    }

    const url = GET_COIN_BY_ID_URL.replace(":coinId", coinId);

    var headers = new Headers();
    headers.append('pragma', 'no-cache'); 
    headers.append('cache-control', 'no-cache');

    const response = await fetch(url ,  {headers});
    const selectedCoin = await response.json();

    const currentPrices = selectedCoin?.market_data?.current_price;
    if (!currentPrices) {
      alert("error no market data available!");
      return;
    }
    const cachedCoin = getCoinsFromCache().find((coin) => coin.id === coinId);
    cachedCoin.currentPrices = CurrentPricesType({ currentPrices });
    cachedCoin.details = CoinDetailsType(selectedCoin);

    return cachedCoin;
  }

  async function getCoinsPrices({symbols}) {
    if (!symbols?.length) {
      alert(`getCoinsPrices -> symbols are required!`);
      return;
    }
  
    const url = GET_COINS_PRICES_URL.replace(":coinsSymbols", symbols.join(","  )).replace(":currency", 'USD,EUR,ILS');

    var headers = new Headers();
    headers.append('pragma', 'no-cache'); 
    headers.append('cache-control', 'no-cache');

    const response = await fetch(url,  {cache: "no-cache"});
    const selectedCoin = await response.json();

    coinsGraphHistory.push( {time: new Date(),   data: selectedCoin});

    if(coinsGraphHistory.length > 10) { 
      let history = storageService.getItem(Config.GRAPH_HISTORY_KEY) ?? [];

      if( history.length > 450 ) { 
        history = history.splice(0, 10);
      }

      history.push(...coinsGraphHistory);
      storageService.setItem(Config.GRAPH_HISTORY_KEY , JSON.stringify(history));
      coinsGraphHistory.length = 0;
    }

    return selectedCoin;
  }
  GET_COINS_PRICES_URL

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
    
     const filterCoins =(await dataCoinService.getCoinsWithUserSelection()).slice(
      0,
      Config.COINS_DISPLAY_COUNT
    ).filter((coin) => coin.name.toLowerCase().indexOf(keyWord?.toLowerCase()) > -1);

    return filterCoins;
  }


  async function getUserSelectedCoinsPrices(){
    const userSelectionCoins = await getUserSelectedCoins();

    const symbols = (await getAllCoins()).map(coin => coin.symbol);
    return await getCoinsPrices( {symbols});
  }

  return {
    searchCoins,
    getAllCoins,
    getCoinById,
    getUserSelectedCoins,
    getCoinsWithUserSelection,
    clearCache,
    getUserSelectedCoinsPrices
  };
}

const dataCoinService = CoinService();
