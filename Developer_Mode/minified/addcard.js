"use strict";
const checkBtn = document.getElementsByClassName("lp-btn7");
const cardRow = document.getElementsByClassName("card-row")[0];
const cardName = document.getElementsByClassName("card-name");
const cardAct = document.getElementsByClassName("card-act");
const cardSubAct = document.getElementsByClassName("card-sub-act");
const cardRarity = document.getElementsByClassName("rarity");
const cardOld = document.getElementsByClassName("card-old");
const cardImage = document.getElementsByClassName("cardImage");
const cardCustomName = document.getElementsByClassName("card-namec")[0];
const cardCustomAct = document.getElementsByClassName("card-actc")[0];
const cardCustomSubAct = document.getElementsByClassName("card-sub-actc")[0];
const cardCustomRarity = document.getElementsByClassName("rarityc")[0];
const loader = document.getElementsByClassName("loader")[0];
const message = document.getElementsByClassName("message")[0];
const errorM = document.getElementsByClassName("lp-234err");
const inputs = document.getElementsByClassName("check-error");
const imagePop = document.getElementsByClassName("lp-321im");
loader.style.display = "none";
let lp_cc = 0;
let LpEvents = ["pride", "summer 2022", "halloween 2022"];

createForm();

checkBtn[0].addEventListener("click", () => {
  if (cardRow.children.length < 15) {
    createForm();
  } else {
    message.style.display = "block";
    message.innerText = "The limit is 15 please save!";
    window.scrollTo(0, document.body.scrollTop);
  }
});

checkBtn[1].addEventListener("click", async () => {
  let count = 0;
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type == "file" && inputs[i].files.length == 0) {
      errorM[i].style.display = "block";
      count++;
    } else {
      if (inputs[i].value == "" && inputs[i].classList[0] != "card-sub-act") {
        checkForErrors();
        errorM[i].style.display = "block";
        count++;
      }
    }
  }

  if (count > 0) {
    message.innerText = "You forgot some fields to fill.";
    window.scrollTo(0, document.body.scrollTop);
  } else {
    loader.style.display = "block";
    let check = 0;
    for (let items = 0; items < cardRow.children.length; items++) {
      const wait = await axios.post(
        "/addcard",
        {
          name: cardName[items].value,
          act: cardAct[items].value,
          subAct: cardSubAct[items].value,
          rarity: cardRarity[items].value,
          old: cardOld[items].value,
          image: cardImage[items].files[0],
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (wait.data == "ok") {
        check++;
      } else {
        message.style.display = "block";
        message.innerText = wait.data;
        break;
      }
    }

    if (cardRow.children.length == check) {
      message.style.display = "block";
      message.innerText = `${check} card${
        check == 1 ? "" : "s"
      } successfully added!`;
      cardRow.innerHTML = "";
      createForm();

      setTimeout(window.location.reload(), 1500);
    }
    loader.style.display = "none";
  }
});

checkBtn[2].addEventListener("click", () => {
  changeValue(
    cardCustomName,
    cardCustomAct,
    cardCustomSubAct,
    cardCustomRarity
  );
});

checkBtn[3].addEventListener("click", () => {
  localStorage.setItem("custom-name", cardCustomName.value);
  localStorage.setItem("custom-act", cardCustomAct.value);
  localStorage.setItem("card-sub-actc", cardCustomSubAct.value);
  localStorage.setItem("custom-rarity", cardCustomRarity.value);
  window.location.reload();
});

checkBtn[4].addEventListener("click", () => {
  localStorage.clear();
  window.location.reload();
});

function createForm() {
  const cardsGroupD = document.createElement("div");
  cardsGroupD.className = "cards-group";
  const highlightS = document.createElement("span");
  highlightS.className = "highlight";
  const barS = document.createElement("span");
  barS.className = "bar";
  const errorM = document.createElement("p");
  errorM.className = "lp-234err";
  errorM.innerText = "Please fill this field out!";

  const cardNameD = document.createElement("div");
  cardNameD.className = `group lp-32s`;
  const cardNameI = document.createElement("input");
  cardNameI.name = "name";
  cardNameI.type = "text";
  cardNameI.required = true;
  cardNameI.autocomplete = "off";
  cardNameI.className = "card-name check-error";
  const cardNameL = document.createElement("label");
  cardNameL.innerText = "Card Name";

  const cardActD = document.createElement("div");
  cardActD.className = `group lp-32s`;
  const cardActI = document.createElement("input");
  cardActI.name = "act";
  cardActI.type = "text";
  cardActI.required = true;
  cardActI.autocomplete = "off";
  cardActI.className = "card-act check-error";
  const cardActL = document.createElement("label");
  cardActL.innerText = "Card Act";

  const cardSubActD = document.createElement("div");
  cardSubActD.className = `group lp-32s`;
  cardSubActD.style.display = "none";
  const cardSubActI = document.createElement("input");
  cardSubActI.name = "sub-act";
  cardSubActI.type = "text";
  cardSubActI.required = true;
  cardSubActI.autocomplete = "off";
  cardSubActI.className = "card-sub-act";
  const cardSubActL = document.createElement("label");
  cardSubActL.innerText = "Card Sub-Act";

  const cardRarityD = document.createElement("div");
  cardRarityD.className = `group lp-32s`;
  const cardRarityS = document.createElement("select");
  cardRarityS.name = "rarity";
  cardRarityS.className = "rarity";
  cardRarityS.style = "padding: 10px 10px 10px 0px !important";
  for (let r = 0; r < 5; r++) {
    const option = document.createElement("option");
    option.value = r + 1;
    option.innerText = "⭐".repeat(r + 1);
    cardRarityS.appendChild(option);
  }
  const cardRarityL = document.createElement("label");
  cardRarityL.innerText = "Card Rarity";

  const cardOldD = document.createElement("div");
  cardOldD.className = `group lp-32s`;
  const cardOldS = document.createElement("select");
  cardOldS.name = "old";
  cardOldS.className = "card-old";
  cardOldS.style = "padding: 10px 10px 10px 0px !important";
  const optionF = document.createElement("option");
  optionF.value = "true";
  optionF.innerText = "No";
  const optionT = document.createElement("option");
  optionT.value = "false";
  optionT.innerText = "Yes";
  cardOldS.append(optionT, optionF);
  const cardOldL = document.createElement("label");
  cardOldL.innerText = "Card Drop";

  const cardImageD = document.createElement("div");
  cardImageD.className = `group lp-32s file-area`;
  const cardImageI = document.createElement("input");
  cardImageI.type = "file";
  cardImageI.name = "image";
  cardImageI.required = true;
  cardImageI.className = `cardImage check-error ${lp_cc}`;
  cardImageI.onchange = (e) => submitImage(e);
  const cardImageFileD = document.createElement("div");
  cardImageFileD.className = "file-dummy";
  const SuccessP = document.createElement("p");
  SuccessP.className = "success root-p";
  SuccessP.innerText = "Thanks for creating cards.";
  const DefaultP = document.createElement("p");
  DefaultP.className = "default root-p";
  DefaultP.innerText = "Please select some card.";
  cardImageFileD.append(SuccessP, DefaultP);
  const cardImageErrorD = document.createElement("div");
  cardImageErrorD.className = "lp-er32";
  const popCardImage = document.createElement("img");
  popCardImage.className = "lp-321im";
  popCardImage.src = "/Images/Nezoku.png";

  cardImageErrorD.append(errorM.cloneNode(true), popCardImage);

  const line = document.createElement("div");
  line.className = "group";
  line.style = "width: 100%; height: 6px; background: white;";

  changeValue(cardNameI, cardActI, cardSubActI, cardRarityS, cardSubActD);

  cardNameD.append(
    cardNameI,
    highlightS,
    barS,
    cardNameL,
    errorM.cloneNode(true)
  );
  cardActD.append(cardActI, highlightS, barS, cardActL, errorM.cloneNode(true));
  cardSubActD.append(
    cardSubActI,
    highlightS,
    barS,
    cardSubActL,
    errorM.cloneNode(true)
  );
  cardRarityD.append(cardRarityS, cardRarityL);
  cardOldD.append(cardOldS, cardOldL);
  cardImageD.append(cardImageI, cardImageFileD, cardImageErrorD);
  cardsGroupD.append(
    cardNameD,
    cardActD,
    cardSubActD,
    cardRarityD,
    cardOldD,
    cardImageD,
    line
  );

  cardRow.appendChild(cardsGroupD);
  lp_cc++;
  checkForErrors();
}

function changeValue(cardName, cardAct, cardSubAct, cardRarity, cardSubActD) {
  const nameCustom = localStorage.getItem("custom-name");
  const actCustom = localStorage.getItem("custom-act");
  const subActCustom = localStorage.getItem("card-sub-actc");
  const rarityCustom = localStorage.getItem("custom-rarity")
    ? localStorage.getItem("custom-rarity")
    : 1;

  cardName.value = nameCustom;
  cardAct.value = actCustom;
  cardSubAct.value = subActCustom;
  cardRarity.value = rarityCustom;

  if (cardSubActD && LpEvents.includes(actCustom?.toLowerCase())) {
    cardSubActD.style.display = "block";
  }
}

function checkForErrors() {
  const divs = document.getElementsByClassName("lp-32s");
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type == "text") {
      inputs[i].addEventListener("keyup", () => {
        if (
          inputs[i].classList[0] == "card-act" &&
          LpEvents.includes(inputs[i].value.toLowerCase())
        ) {
          divs[i + Number(cardRow.children.length)].style.display = "block";
        } else if (inputs[i].classList[0] == "card-act") {
          divs[i + Number(cardRow.children.length)].style.display = "none";
        }
        errorM[i].style.display = "none";
      });
    } else continue;
  }
}

function submitImage(e) {
  const index = Number(e.srcElement.classList[2]);
  errorM[index == 0 ? 2 : (index + 1) * 3 - 1].style.display = "none";
  const smallImage = imagePop[index];
  smallImage.style.display = "block";
  smallImage.src = URL.createObjectURL(e.srcElement.files[0]);
  smallImage.onload = () => URL.revokeObjectURL(smallImage.src);
}
