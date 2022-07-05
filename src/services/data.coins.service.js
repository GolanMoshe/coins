function CoinService() {
  const GET_ALL_COINS_URL = "https://api.coingecko.com/api/v3/coins/list";
  const GET_COIN_BY_ID_URL = "https://api.coingecko.com/api/v3/coins/:coinId";
  let cachedCoins = null;

  function getAllCoins({ disableCache = false } = {}) {
    if (disableCache) cachedCoins = null;

    if (!!cachedCoins) return cachedCoins;

    fetch(GET_ALL_COINS_URL)
      .then((response) => response.json())
      .then((data) => {
        const selectCoins = data.splice(0, 100);
        cachedCoins = selectCoins.map((coin) => CoinType(coin));
        console.log(cachedCoins);
        return cachedCoins;
      });
  };

  function getCoinById({ coinId }) {
    if (!coinId || !cachedCoins) {
      alert(`coinId and cachedCoins are required!`);
      return;
    };

    const url = GET_COIN_BY_ID_URL.replace(":coinId", coinId);

    fetch(url)
      .then((response) => response.json())
      .then((selectedCoin) => {
        const cachedCoin = cachedCoins.find((coin) => coin.id === coinId);

        cachedCoin.details = selectedCoin;

        return selectedCoin;
      });
  }
  return {
    getAllCoins,
    getCoinById,
  };
}

const coinService = CoinService();
