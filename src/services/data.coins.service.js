function CoinService() {
  const GET_ALL_COINS_URL = "https://api.coingecko.com/api/v3/coins/list";
  const GET_COIN_BY_ID_URL = "https://api.coingecko.com/api/v3/coins/:coinId";

  function getAllCoins() {
    fetch(GET_ALL_COINS_URL)
      .then((response) => response.json())
      .then((data) => {
        const selectCoins = data.splice(0, 100);
        console.log(selectCoins);
        return selectCoins;
      });
  }

  function getCoinById(coinId) {
    const url = GET_COIN_BY_ID_URL.replace(":coinId", coinId);

    fetch(url)
      .then((response) => response.json())
      .then((selectedCoin) => {
        console.log(selectedCoin);
        return selectedCoin;
      });
  }
  return {
    getAllCoins,
    getCoinById,
  };
}

const coinService = CoinService();
