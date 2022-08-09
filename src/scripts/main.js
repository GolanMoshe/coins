const getHtmlElement = (id) => {
  if (!id) throw { message: "getHtmlElement -> id id required" };
  return $(`#${id}`).length ? $(`#${id}`)[0] : null;
};

const getHtmlInputValue = (elementId) => {
  return getHtmlElement(elementId).value;
};

const setInputValue = (elementId, value) => {
  getHtmlElement(elementId).value = value;
};

const onCoinSelectedStatisChanged = (e) => {
  //call the user.service toggleCoinSelection functiob
  const coinId = e.target.attributes.data_coin_id.value;
  const isChecked = e.target.checked;
  const currentStatus = userService.toggleCoinSelection({ coinId, isChecked });
  e.target.checked = currentStatus;
  PrintCoins();
};

const form = document.querySelector("form");
form.addEventListener("change", function () {
  setInputValue(
    Config.USER_FORM.SUBMIT,
    langService.getLabel("userForm.submitBtn.saveUser")
  );
});



setInterval(() => {
  dataCoinService.clearCache();
  PrintCoins();
}, Config.COINS_CACHE_LIVE_TIME);

const onAddUserHandler = (e) => {
  e.preventDefault();

  const fName = getHtmlInputValue(Config.USER_FORM.FNAME);
  const lName = getHtmlInputValue(Config.USER_FORM.LNAME);
  const phone = getHtmlInputValue(Config.USER_FORM.PHONE);
  const email = getHtmlInputValue(Config.USER_FORM.EMAIL);
  const isPremium = getHtmlElement(Config.USER_FORM.IS_PREMIUM)?.checked ?? false;
  const profile = { fName, lName, phone, email, isPremium };
  userService.addUser(profile);

  setInputValue(
    Config.USER_FORM.SUBMIT,
    langService.getLabel("userForm.submitBtn.editUser")
  );
};

function updateHtmlForm() {
  const user = userService.getUser();
  const btnText = !user
    ? langService.getLabel("userForm.submitBtn.addUser")
    : langService.getLabel("userForm.submitBtn.editUser");
  setInputValue(Config.USER_FORM.SUBMIT, btnText);
  if (!user) {
    return;
  }

  setInputValue(Config.USER_FORM.FNAME, user.fName);
  setInputValue(Config.USER_FORM.LNAME, user.lName);
  setInputValue(Config.USER_FORM.PHONE, user.phone);
  setInputValue(Config.USER_FORM.EMAIL, user.email);
  if (user.isPremium) {
    getHtmlElement(Config.USER_FORM.IS_PREMIUM).checked = true;
  }
}

async function fetchSelectedCoinsPrice() { 
  
  const symbol2Price = await dataCoinService.getUserSelectedCoinsPrices();
  console.log(`fetchSelectedCoinsPrice -> symbol2Price:` , symbol2Price);

  for (const [key, value] of Object.entries(symbol2Price)) {

    const usdRef = document.querySelector(`#coin-list-container .coin-container[data_coin_symbol='${key}'] .coin-price-usd`);
  
    if(usdRef) { 
      document.querySelector(`#coin-list-container .coin-container[data_coin_symbol='${key}'] .coin-price-usd`).innerHTML = `${value.USD.toFixed(2)}$`;
      document.querySelector(`#coin-list-container .coin-container[data_coin_symbol='${key}'] .coin-price-eur`).innerHTML = `${value.EUR.toFixed(2)}€`;
    }
  }
}


async function PrintCoins(filterdCoins = undefined) {
  const coinTemplate = getHtmlElement("coin-template");
  const coinListContainerRef = getHtmlElement("coin-list-container");
  coinListContainerRef.innerHTML = "";

  
  const coins =  filterdCoins ? filterdCoins :  (await dataCoinService.getCoinsWithUserSelection()).slice(
    0,
    Config.COINS_DISPLAY_COUNT
  )  ;


  const sortedCoins = coins.sort((a,b) => { 

    if(a.isSelected < b.isSelected) { 
        return 1
    }
    
    if(a.isSelected > b.isSelected) { 
      return -1
    }
  
    return 0
  });

  for (const coin of sortedCoins) {
    const coinCardNode = coinTemplate.content.cloneNode(true);
    const coinElemntRef = coinCardNode.querySelector(".coin-container");
    coinElemntRef.setAttribute("data_coin_symbol", coin.symbol.toUpperCase());
    coinElemntRef.setAttribute("data_coin_id", coin.id);
    const coinNameRef = coinCardNode.querySelector(".coin-name");

    const coinCheckBoxRef = coinCardNode.querySelector(
      ".card-body div.form-check input.form-check-input"
    );
    coinCheckBoxRef.setAttribute("data_coin_id", coin.id);
  

    if (coin.isSelected) {
      coinCheckBoxRef.setAttribute("checked", "true");
    }

    coinCheckBoxRef.onclick = onCoinSelectedStatisChanged;
    coinNameRef.innerText = coin.name;
    coinListContainerRef.appendChild(coinCardNode);
  }
}

const changeLanguage = (lang) => {
  langService.setLanguage(lang);
  window.location.reload();
};

const cleanCache = () => {
  dataCoinService.clearCache();
  document.location.reload();
};

let langService;
let errorMessageContainer;
let fetchSelectedCoinsPriceIntervalId = null;



const loadApplication = async () => {
  try {
    errorMessageContainer = getHtmlElement("error-message-container");
    langService = LangService();
    
    getHtmlElement("searchCoinsInput").addEventListener('keyup', async (event)=> {
      const filterCoins = await dataCoinService.searchCoins(event.target.value);
      PrintCoins(filterCoins);
    });

    
    updateHtmlForm();
    await PrintCoins();

    function instantGratification( fn, delay ) {
      fn();
      clearInterval(fetchSelectedCoinsPriceIntervalId);
      fetchSelectedCoinsPriceIntervalId = setInterval( fn, delay );
    }

    instantGratification(fetchSelectedCoinsPrice, 2000);
    
    
  } catch (error) {
    console.error(`problem getAllCoins`, error);
    errorMessageContainer.innerText = error.message;
  }
};



