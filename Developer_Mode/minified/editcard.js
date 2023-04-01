"use strict";
const filter = document.getElementsByClassName("search-input")[0];
const cards = document.getElementsByClassName("lp-1bg-3");
const cardNameInput = document.getElementsByClassName("card-name");
const cardActInput = document.getElementsByClassName("card-act");
const cardSubActInput = document.getElementsByClassName("card-sub-act");
const cardCodeInput = document.getElementsByClassName("card-code");
const cardRarityInput = document.getElementsByClassName("rarity");
const cardOldInput = document.getElementsByClassName("card-old");
const cardImageInput = document.getElementsByClassName("card-image");
const cardImageSmall = document.getElementsByClassName("lp-321im");
const editSaveBtn = document.getElementsByClassName("lp-23sp-2")[0];
const searchBtn = document.getElementsByClassName("search-btn")[0];
const message = document.getElementsByClassName("message")[0];
const loader = document.getElementsByClassName("loader")[0];
const downUp = document.getElementsByClassName("scroll")[0];
const password = document.getElementById("password");
const row = document.getElementsByClassName("lp-1bg-2")[0];
import notification from "./nxymncsld.min.js";
let response;
let observer;
let selectedCards = [];

window.addEventListener("DOMContentLoaded", async () => {
  response = await axios.get(`/givecard/every`);
  fetchCardsFromServer();

  cardImageInput[0].addEventListener("change", (e) => submitImage(e));
  document.addEventListener("keypress", function onEvent(event) {
    if (event.key === "Enter") {
      observer.disconnect();
      searchCard();
    }
  });

  searchBtn.addEventListener("click", () => {
    observer.disconnect();
    searchCard();
  });

  editSaveBtn.addEventListener("click", async () => {
    loader.style.display = "block";
    let responseP = await axios.post(
      "/editcard",
      {
        name: cardNameInput[0].value,
        act: cardActInput[0].value,
        subAct: cardSubActInput[0].value,
        rarity: cardRarityInput[0].value,
        old: cardOldInput[0].value,
        code: cardCodeInput[0].value,
        image: cardImageInput[0].files[0],
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (responseP.data == "ok") {
      window.scrollTo(0, document.body.scrollTop);
      message.innerText = "Successfully changed!";
    } else {
      window.scrollTo(0, document.body.scrollTop);
      loader.style.display = "none";
      return (message.innerText = responseP.data);
    }

    row.innerHTML = "";
    response = await axios.get(`/givecard/every`);
    fetchCardsFromServer();

    loader.style.display = "none";
  });

  downUp.addEventListener("click", () =>
    window.scrollTo(0, document.body.scrollTop)
  );

  function getInfo(cards) {
    const cardName = cards.getAttribute("data-name");
    const cardAct = cards.getAttribute("data-act");
    const cardSubAct = cards.getAttribute("data-subAct");
    const cardRarity = cards.getAttribute("data-rarity");
    const cardCode = cards.getAttribute("data-code");
    const cardOld = cards.getAttribute("data-old");
    const cardImage = cards.getAttribute("data-image");

    return {
      cardName,
      cardAct,
      cardSubAct,
      cardCode,
      cardRarity,
      cardOld,
      cardImage,
    };
  }

  async function fetchCardsFromServer() {
    let newCards = response.data;
    message.innerText = `About ${response.data.length} cards are in the Database!`;

    for (let i = 0; i < 10; i++) {
      createCard(newCards[i]);
    }
    newCards.splice(0, 10);

    setChecks();
    checkLoader(newCards);
    loader.style.display = "none";
  }

  function createCard(cardsResponse) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "lp-1bg-3 col-12 col-md-6 col-lg-4";
    cardDiv.setAttribute("data-name", cardsResponse?.name);
    cardDiv.setAttribute("data-act", cardsResponse?.act);
    cardDiv.setAttribute("data-subAct", cardsResponse?.subAct);
    cardDiv.setAttribute("data-rarity", cardsResponse?.rarity.length);
    cardDiv.setAttribute("data-old", cardsResponse?.old);
    cardDiv.setAttribute("data-image", cardsResponse?.image);
    cardDiv.setAttribute("data-code", cardsResponse?.code);

    const cardDivItems = document.createElement("div");
    cardDivItems.className = "lp-0clxnc1";

    const cardDivItemsFlex = document.createElement("div");
    cardDivItemsFlex.className = "lp-3clxnc4";

    const cardDivInfo = document.createElement("div");
    cardDivInfo.className = "lp-4clxnc5";

    const cardDivInfoP = document.createElement("div");
    cardDivInfoP.className = "lp-0clxnv1";

    const cardName = document.createElement("p");
    cardName.innerHTML = `Name: <span class="bg root-p"> ${cardsResponse?.name} </span>`;

    const cardAct = document.createElement("p");
    cardAct.innerHTML = `Act: <span class="bg root-p"> ${cardsResponse?.act} </span>`;

    const cardSubAct = document.createElement("p");
    let subActName = cardsResponse?.subAct;
    if (cardsResponse?.subAct == "" || cardsResponse?.subAct == undefined) {
      cardSubAct.style.display = "none";
      subActName = `empty`;
    }
    cardSubAct.innerHTML = `Sub-Act: <span class="bg root-p">${subActName}</span>`;

    const cardRarity = document.createElement("p");
    cardRarity.innerHTML = `Rarity: <span class="bg"> ${cardsResponse?.rarity} </span>`;

    const cardCode = document.createElement("p");
    cardCode.innerHTML = `Code: <span class="bg root-p"> ${cardsResponse?.code} </span>`;

    const cardCreatedAt = document.createElement("p");
    cardCreatedAt.innerHTML = `Created At: <span class="bg root-p" style="font-size: 13.5px !important"> ${cardsResponse?.createdAt} </span>`;

    const cardOldAct = document.createElement("p");
    cardOldAct.innerHTML = `Drop: <span class="bg root-p">${
      cardsResponse?.old == undefined
        ? "Yes"
        : cardsResponse?.old == true
        ? "No"
        : "Yes"
    }</span>`;

    const cardDivInfoI = document.createElement("div");
    cardDivInfoI.className = "lp-0clxnv2";

    const cardImageDiv = document.createElement("img");
    cardImageDiv.className = "lp-0clxnv3";
    cardImageDiv.src = "/Images/Nezoku.png";

    const DivBtn = document.createElement("div");
    DivBtn.className = "lp-6clxnc7";

    const EditBtn = document.createElement("button");
    EditBtn.className = "lp-7clxnc8 lp-btn7 lp-btn7-y ";
    EditBtn.innerText = "Edit";
    EditBtn.setAttribute("data-toggle", "modal");
    EditBtn.setAttribute("data-target", "#edit_modal");

    const DeleteBtn = document.createElement("button");
    DeleteBtn.className = "lp-8clxnc9 lp-btn7 lp-btn7-r";
    DeleteBtn.innerText = "Delete";
    DeleteBtn.setAttribute("data-toggle", "modal");
    DeleteBtn.setAttribute("data-target", "#delete_modal");

    const SelectBtn = document.createElement("button");
    SelectBtn.className = "lp-0clxnf1 lp-btn7 lp-btn7-g";
    SelectBtn.innerText = "Select";

    DivBtn.append(EditBtn, DeleteBtn, SelectBtn);
    cardDivInfoP.append(
      cardName,
      cardAct,
      cardSubAct,
      cardRarity,
      cardCode,
      cardCreatedAt,
      cardOldAct
    );
    cardDivInfoI.appendChild(cardImageDiv);
    cardDivInfo.append(cardDivInfoP, cardDivInfoI);
    cardDivItemsFlex.append(cardDivInfo, DivBtn);
    cardDivItems.appendChild(cardDivItemsFlex);
    cardDiv.appendChild(cardDivItems);
    row.appendChild(cardDiv);
    setImages();
  }

  function submitImage(e) {
    cardImageSmall[0].style.display = "block";
    cardImageSmall[0].src = URL.createObjectURL(e.srcElement.files[0]);
    cardImageSmall[0].onload = () => URL.revokeObjectURL(cardImageSmall[0].src);
  }

  function setImages() {
    for (let i = 0; i < cards.length; i++) {
      cards[i].addEventListener("mouseover", () => {
        const img = cards[i].getElementsByClassName("lp-0clxnv3")[0];
        if (img.src != cards[i].getAttribute("data-image")) {
          img.src = cards[i].getAttribute("data-image");
          img.style.display = "block";
        } else {
          img.style.display = "block";
        }
      });

      cards[i].addEventListener("mouseout", () => {
        const img = cards[i].getElementsByClassName("lp-0clxnv3")[0];
        img.style.display = "none";
      });
    }
  }

  function checkLoader(newCards) {
    const cards = newCards;
    observer = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          if (cards.length != 0) {
            const length = cards.length >= 10 ? 10 : cards.length;

            for (let i = 0; i < length; i++) {
              createCard(cards[i]);
            }
            cards.splice(0, length);

            setChecks();
          }
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    observer.observe(document.getElementById("checker"));
  }

  function searchCard() {
    const searchValue = filter.value;

    if (searchValue != "") {
      loader.style.display = "block";
      let newCards = [];

      for (let i = 0; i < response.data.length; i++) {
        const card = response.data[i];

        if (
          card.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          card.act.toLowerCase().includes(searchValue.toLowerCase()) ||
          card.code.includes(searchValue) ||
          card.old.toString().includes(searchValue.toLowerCase()) ||
          card.subAct.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          newCards.push(card);
        }
      }

      const length = newCards.length < 10 ? newCards.length : 10;
      message.innerText = `I found ${newCards.length}  card${
        newCards.length == 1 ? "" : "s"
      }`;

      row.innerHTML = "";

      for (let i = 0; i < length; i++) {
        createCard(newCards[i]);
      }

      newCards.splice(0, length);

      setChecks();
      if (length == 10) {
        checkLoader(newCards);
      }
      loader.style.display = "none";
    } else {
      fetchCardsFromServer();
    }
  }

  function setChecks() {
    const deleteBtn = document.getElementsByClassName("lp-8clxnc9");
    const deleteText = document.getElementsByClassName("lp-3te23")[0];
    const deletsaveBtn = document.getElementsByClassName("lp-32des-2")[0];
    const editBtn = document.getElementsByClassName("lp-7clxnc8");
    const selectBtn = document.getElementsByClassName("lp-0clxnf1");

    for (let i = 0; i < deleteBtn.length; i++) {
      deleteBtn[i].addEventListener("click", async () => {
        let { cardName, cardCode } = getInfo(cards[i]);
        deleteText.innerHTML = `Are you sure to delete <span class="bg">${cardName}</span>`;

        deletsaveBtn.addEventListener("click", async () => {
          const response = await axios.delete("/editcard", {
            headers: {
              Authentication: "***",
            },
            data: {
              code: cardCode,
              password: password.value,
            },
          });

          if (response.data == "ok") {
            message.innerText = "Successfully deleted the card.";
            cards[i].remove();
          } else {
            message.style.display = "block";
            message.innerText = response.data;
          }
        });
      });
    }

    for (let i = 0; i < editBtn.length; i++) {
      editBtn[i].addEventListener("click", () => {
        let card = getInfo(cards[i]);
        cardNameInput[0].value = card?.cardName;
        cardActInput[0].value = card?.cardAct;
        cardSubActInput[0].value =
          card?.cardSubAct == "empty" ? null : card?.cardSubAct;
        cardCodeInput[0].value = card?.cardCode;
        cardRarityInput[0].value = card?.cardRarity;
        cardOldInput[0].value = card?.cardOld;
        cardImageSmall[0].src = card?.cardImage;
      });
    }

    for (let i = 0; i < selectBtn.length; i++) {
      selectBtn[i].addEventListener("click", () => {
        selectBtn[i].style.visibility = "hidden";
        let card = getInfo(cards[i]);
        card["index"] = i;
        selectedCards.push(card);
        new notification({
          text: `${selectedCards.length} card${
            selectedCards.length != 1 ? "s are" : " is"
          } selected`,
          position: "top-right",
          pauseOnHover: true,
          pauseOnFocusLoss: true,
        });
      });
    }

    checkChange();

    function checkChange() {
      const saveBtn = document.getElementsByClassName("lp-23sp-3")[0];

      saveBtn.addEventListener("click", async () => {
        loader.style.display = "block";
        for (let i = 0; i < selectedCards.length; i++) {
          let act =
            cardActInput[1].value != ""
              ? cardActInput[1].value
              : selectedCards[i].cardAct;

          let subAct =
            cardSubActInput[1].value != ""
              ? cardSubActInput[1].value
              : selectedCards[i].cardSubAct;

          let rarity =
            cardRarityInput[1].value != ""
              ? cardRarityInput[1].value
              : selectedCards[i].cardRarity;

          let old =
            cardOldInput[1].value != ""
              ? cardOldInput[1].value
              : selectedCards[i].cardOld;

          let responseP = await axios.post("/editcard", {
            name: selectedCards[i].cardName,
            act,
            subAct,
            rarity,
            old,
            code: selectedCards[i].cardCode,
          });
        }

        message.innerText = "The changes are completed!";
        loader.style.display = "none";
      });
    }
  }
});
