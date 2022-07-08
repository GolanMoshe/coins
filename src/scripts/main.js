const errorMessageContainer = document.getElementById('error-message-container');


const onCoinSelectedStatisChanged = (e) => {
  const selectedCoin = e.target.attributes.data_coin_id.value;
  console.log(`selectedCoin ${selectedCoin} ${e.target.checked}`)
}


const onLoad = async () => {
  try {

    const coinTemplate = document.getElementById('coin-template')
    const coinListContainerRef = document.getElementById('coin-list-container');
    const coins = (await coinService.getAllCoins()).slice(0, 100)

    for (const coin of coins) {
      const coinCardNode = coinTemplate.content.cloneNode(true);
      const coinNameRef = coinCardNode.querySelector(".coin-name");

      const coinCheckBoxRef = coinCardNode.querySelector(".card-body div.form-check input.form-check-input");
      coinCheckBoxRef.setAttribute("data_coin_id", coin.id);
      coinCheckBoxRef.onclick = onCoinSelectedStatisChanged
      coinNameRef.innerText = coin.name;
      coinListContainerRef.appendChild(coinCardNode);
    }
  } catch (error) {
    console.error(`problem getAllCoins`, error);
    errorMessageContainer.innerText = error.message
  }
};

