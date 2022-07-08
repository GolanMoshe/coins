function CoinService() {
  const GET_ALL_COINS_URL = "https://api.coingecko.com/api/v3/coins/list";
  const GET_COIN_BY_ID_URL = "https://api.coingecko.com/api/v3/coins/:coinId";
  let cachedCoins = null;

  async function getAllCoins({ disableCache = false } = {}) {
    if (disableCache) cachedCoins = null;

    if (!!cachedCoins) return cachedCoins;

    const response = await fetch(GET_ALL_COINS_URL);
    const coins = await response.json();

    const selectCoins = coins.splice(0, 100);
    cachedCoins = selectCoins.map((coin) => CoinType(coin));
    console.log(cachedCoins);
    return cachedCoins;

  };


  async function getCoinById({ coinId }) {
    if (!coinId || !cachedCoins) {
      alert(`coinId and cachedCoins are required!`);
      return;
    };

    const url = GET_COIN_BY_ID_URL.replace(":coinId", coinId);

    const res = await fetch(url);
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


  return {
    getAllCoins,
    getCoinById,
  };
}

const coinService = CoinService();
