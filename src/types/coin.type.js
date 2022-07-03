const CoinType = ({ id, name, symbol, isSelected = false, details = null }) => {
  return {
    id,
    name,
    symbol,
    isSelected,
    details,
  };
};

//TODO: Define Coin Details use camelCase instead of snakeCase
const CoinDetailTypes = ({ image, market_data }) => {
  return {
    thumbnail: image.thumbnail,
    currentPrice: {
      sekel: market_data?.current_price?.ils ?? "NOT FOUND",
      eur: market_data?.current_price?.eur ?? "NOT FOUND",
      usd: market_data?.current_price?.usd ?? "NOT FOUND",
    },
  };
};
