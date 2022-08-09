const CoinType = ({ id, name, symbol, image, details= null, currentPrices = []}) => {
  return {
    id,
    name,
    symbol,
    currentPrices,
    details
    
  };
};

//TODO: Define Coin Details use camelCase instead of snakeCase
const CurrentPricesType = ({ currentPrices }) => {
  return {
      ils: currentPrices?.ils ?? "NOT FOUND",
      eur: currentPrices?.eur ?? "NOT FOUND",
      usd: currentPrices?.usd ?? "NOT FOUND",
    }
};


//TODO: Define Coin Details use camelCase instead of snakeCase
const CoinDetailsType = ({ image }) => {
  return {
      thumb:image?.thumb
    }
};

