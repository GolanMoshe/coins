const errorMessageContainer = document.getElementById('error-message-container');
    const onLoad = async () => {
      try {

        const coinTemplate = document.getElementById('coin-template')
        const coinListContainerRef = document.getElementById('coin-list-container');
        const coins = (await coinService.getAllCoins()).slice(0, 100)

        //const selectedCoins = await coinService.getSelectedCoins()



        for (const coin of coins) {

          //Best solution
          const coinCardNode = coinTemplate.content.cloneNode(true);
          const coinNameRef = coinCardNode.querySelector(".coin-name");

          const coinCheckBoxRef = coinCardNode.querySelector(".card-body div.form-check input.form-check-input");
          coinCheckBoxRef.setAttribute("data_coin_id", coin.id);
          coinCheckBoxRef.onclick = (e) => {

            const selectedCoin = e.target.attributes.data_coin_id.value;
            console.log(`selectedCoin ${selectedCoin} ${e.target.checked}`)
          }

          coinNameRef.innerText = coin.name;
          coinListContainerRef.appendChild(coinCardNode);

          // First Solution
          // append strings
          //coinListContainerRef.innerHTML += template


          // Second Solution  
          //coinListContainerRef.insertAdjacentHTML('beforeend', coinHtmlTemplate);
          //elements.push(coinHtmlTemplate);
        }

        //coinListContainerRef.innerHTML = elements.join("");

      } catch (error) {
        console.error(`problem getAllCoins`, error);
        errorMessageContainer.innerText = error.message
      }
    };

 