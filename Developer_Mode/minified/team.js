const addBtn = document.getElementsByClassName("lp-56am-0")[0];
const deleteBtn = document.getElementsByClassName("deleteUser");
const staffIdInput = document.getElementsByClassName("lp-54am-0")[0];
const staffTypeInput = document.getElementsByClassName("lp-55am-0")[0];
const staffAllowed = document.getElementsByClassName("lp-23ch")[0];
const message = document.getElementsByClassName("message")[0];
const tbodyd = document.getElementsByClassName("lp-trb")[0];
const loader = document.getElementsByClassName("loader")[0];
const checkbox = document.getElementsByClassName("lp-2che2");
const roles = document.getElementsByClassName("lp-r2cs");
const userId = document.getElementsByClassName("id");
const checkboxTxt = document.getElementsByClassName("txt");
const background = {
  Developer: "#1abc9ced",
  "Head-Card-Creator": "#e65589",
  Support: "#3498db",
  Artist: "#ad1457",
  "Card-Creator": "#9b59b6",
};
let hcc = false;
let s = false;
let a = false;
let cc = false;

staffAllowed.addEventListener(
  "change",
  () =>
    (checkboxTxt[checkboxTxt.length - 1].innerText = staffAllowed.checked
      ? "Can see!"
      : "Can't see!")
);

addBtn.addEventListener("click", async () => {
  if (staffIdInput.value.length == 0) {
    message.innerText = "I need a user id!";
    return;
  }

  loader.style.display = "block";
  const response = await axios.put(
    "/staff",
    {
      user: staffIdInput.value.toString(),
      type: staffTypeInput.value.toString(),
      allowed: staffAllowed.checked,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  staffIdInput.value = "";

  if (response.data == "wrong") {
    message.innerText = "The ID is wrong!";
  } else createUserTable(response.data);
  loader.style.display = "none";
});

function createUserTable(staff) {
  const tr = document.createElement("tr");
  tr.className = "id " + staff?.id;
  tr.style.background = background[staff?.type];

  if (!hcc && staff?.type == "Head-Card-Creator") {
    tr.style.borderTop = "4px solid black";
    hcc = true;
  }
  if (!s && staff?.type == "Support") {
    tr.style.borderTop = "4px solid black";
    s = true;
  }
  if (!a && staff?.type == "Artist") {
    tr.style.borderTop = "4px solid black";
    a = true;
  }
  if (!cc && staff?.type == "Card-Creator") {
    tr.style.borderTop = "4px solid black";
    cc = true;
  }

  const TdC1 = document.createElement("td");
  TdC1.className = "column1";
  const TdC1D = document.createElement("div");
  TdC1D.className = "lp-1usew2";
  const TdC1Image = document.createElement("img");
  TdC1Image.src = staff?.avatar;
  const TdC1Name = document.createElement("p");
  TdC1Name.className = "root-p";
  TdC1Name.style = "color: #000000 !important";
  TdC1Name.title = `ID: (${staff?.id})`;
  TdC1Name.innerText = staff?.username;
  TdC1D.append(TdC1Image, TdC1Name);

  const TdC2 = document.createElement("td");
  TdC2.className = "column2";
  const TdC2D = document.createElement("div");
  TdC2D.className = "lp-2usew3";
  const TdC2Span = document.createElement("span");
  TdC2Span.className = "lp-r2cs";
  TdC2Span.innerText = "@" + staff?.type;
  TdC2D.appendChild(TdC2Span);

  const TdC3 = document.createElement("td");
  TdC3.className = "column3";
  const TdC3D = document.createElement("div");
  TdC3D.className = "lp-3usew4";
  const TdC3label = document.createElement("label");
  TdC3label.className = "switch";
  const Td3Input = document.createElement("input");
  Td3Input.type = "checkbox";
  Td3Input.className = "lp-2che2";
  Td3Input.checked = staff?.allowed;
  const Td3InputSpan = document.createElement("span");
  Td3InputSpan.className = "slider round";
  TdC3label.append(Td3Input, Td3InputSpan);
  const TdC3Span = document.createElement("span");
  TdC3Span.className = "txt";
  TdC3Span.innerText = staff?.allowed ? "Can see!" : "Can't see!";
  TdC3D.append(TdC3label, TdC3Span);

  const TdC4 = document.createElement("td");
  TdC4.className = "column4";
  const TdC4D = document.createElement("div");
  TdC4D.className = "lp-4usew5";
  TdC4D.innerHTML = `<svg
  xmlns="http://www.w3.org/2000/svg"
  x="0px"
  y="0px"
  width="30"
  height="30"
  viewBox="0 0 30 30"
  style="fill: #000000; display: none"
  class="editUser"
>
  <path
    d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z"
  ></path>
</svg>
<svg
  xmlns="http://www.w3.org/2000/svg"
  x="0px"
  y="0px"
  width="30"
  height="30"
  viewBox="0 0 30 30"
  style="fill: #000000"
  class="deleteUser"
>
  <path
    d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"
  ></path>
</svg>`;

  TdC1.appendChild(TdC1D);
  TdC2.appendChild(TdC2D);
  TdC3.appendChild(TdC3D);
  TdC4.appendChild(TdC4D);
  tr.append(TdC1, TdC2, TdC3, TdC4);
  tbodyd.appendChild(tr);
}

fetchStaff();

async function fetchStaff() {
  const response = await axios.post("/staff", {
    id: "every",
  });

  const staff = response.data;

  for (let i = 0; i < staff.length; i++) {
    createUserTable(staff[i]);
  }
  loader.style.display = "none";
  checkForChanges();
}

function checkForChanges() {
  for (let i = 0; i < checkbox.length; i++) {
    checkbox[i].addEventListener("change", () => {
      loader.style.display = "block";
      const index = Object.keys(background).findIndex(
        (x) => x === roles[i].innerText.slice(1)
      );
      axios
        .put("/staff", {
          user: userId[i].classList[1],
          type: Object.keys(background)[index],
          allowed: checkbox[i].checked,
        })
        .then((res) => {
          if (res.data) {
            checkboxTxt[i].innerText = checkbox[i].checked
              ? "Can see!"
              : "Can't see!";

            loader.style.display = "none";
          }
        });
    });
  }

  for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", () => {
      loader.style.display = "block";
      axios
        .delete("/staff", {
          withCredentials: true,
          headers: {
            Cookie: "token=lapis-try-to-fetch",
            Authorization: "***",
          },
          data: {
            user: userId[i].classList[1],
          },
        })
        .then((res) => {
          if (res.data == "ok") {
            userId[i].innerHTML = "";
            userId[i].remove();
            message.innerText = "Deleted the User!";
            loader.style.display = "none";
          }
        });
    });
  }

  // for (let i = 0; i < roles.length; i++) {
  //   roles[i].addEventListener("click", () => {
  //     document.getElementsByClassName("lp-2usew3")[
  //       i
  //     ].innerHTML = `<select class="lp-55am-3">
  //     <option style="background: #9b59b6" value="Card-Creator">
  //       Card Creator
  //     </option>
  //     <option style="background: #ad1457" value="Artist">
  //       Artist
  //     </option>
  //     <option style="background: #3498db" value="Support">
  //       Support
  //     </option>
  //     <option
  //       style="background: #e65589"
  //       value="Head-Card-Creator"
  //     >
  //       Head Card Creator
  //     </option>
  //     <option style="background: #1abc9ced" value="Developer">
  //       Developer
  //     </option>
  //   </select>`;

  //     const userChange = document.getElementsByClassName("lp-55am-3");

  //     for (let r = 0; r < userChange.length; r++) {
  //       const index = Object.keys(background).findIndex(
  //         (x) => x === roles[i].innerText.slice(1)
  //       );
  //       userChange[r].value = Object.keys(background)[index];
  //       userChange[r].addEventListener("change", () => {});
  //     }
  //   });
  // }
}
