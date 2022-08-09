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

async function PrintCoins(filterdCoins = undefined) {
  const coinTemplate = getHtmlElement("coin-template");
  const coinListContainerRef = getHtmlElement("coin-list-container");
  coinListContainerRef.innerHTML = "";

  
  const coins =  filterdCoins ? filterdCoins :  (await dataCoinService.getCoinsWithUserSelection()).slice(
    0,
    Config.COINS_DISPLAY_COUNT
  )  ;

  for (const coin of coins) {
    const coinCardNode = coinTemplate.content.cloneNode(true);
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
const loadApplication = async () => {
  try {
    errorMessageContainer = getHtmlElement("error-message-container");
    langService = LangService();
    
    getHtmlElement("searchCoinsInput").addEventListener('keyup', async (e)=> {
      const coins = await dataCoinService.searchCoins(e.target.value);
      console.log('searchCoins', coins);
      PrintCoins(coins);
    });

    updateHtmlForm();
    await PrintCoins();
  } catch (error) {
    console.error(`problem getAllCoins`, error);
    errorMessageContainer.innerText = error.message;
  }
};
