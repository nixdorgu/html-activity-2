function clearForm() {
  const debtor = document.querySelector("#debtor");
  const debt = document.querySelector("#debt");

  debtor.value = "";
  debt.value = "";
}

function updateUI() {
  const debts = document.querySelector("#debts");

  const len = window.localStorage.length;

  if (len == 0) {
    debts.innerHTML =
      '<p class="no-debts" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">No debts to collect</p>';
  } else {
    const noDebt = document.querySelector(".no-debts");
    if (noDebt) noDebt.remove();

    for (let index = 0; index < len; index++) {
      const debtor = window.localStorage.key(index);
      const debt = window.localStorage.getItem(debtor);

      const debtorClassFormat = debtor.replace(/\s{2,}/, " ").replace(" ", "-");
      const current = document.getElementsByClassName(`${debtorClassFormat}`);

      if (document.getElementsByClassName(`${debtorClassFormat}`).length === 0) {
        const div = document.createElement("div");
        div.className = `${debtorClassFormat} debt`;
        div.innerHTML = `<p class="${debtorClassFormat} text">${debtor} - ${debt}</p ><button type="button" class="${debtor} btn-debt">Edit</button>`;
        debts.appendChild(div);

        const editDebtButton = div.lastChild;
        editDebtButton.onclick = editDebt;
      } else {
        if (debt <= 0) {
          localStorage.removeItem(debtor);
          current[0].remove();
          break;
        }

        current[0].innerHTML = `<p class="${debtorClassFormat} text">${debtor} - ${debt}</p><button type="button" class="${debtor} btn-debt">Edit</button>`;
        const editDebtButton = current[0].lastChild;
        editDebtButton.onclick = editDebt;
      }
    }
  }
}

function addDebt(e, name, newDebt) {
  let debt, debtor;

  if (e.target.id == "add-debt") {
    debtor = document.querySelector("#debtor").value;
    debt = document.querySelector("#debt").value;
  } else {
    debtor = name;
    debt = newDebt;
  }

  if (debtor.trim() === "" || Number(debt) === NaN) return; // ALERT FOR BETTER UX
  window.localStorage.setItem(debtor, debt);
  clearForm();
  updateUI();
};

function editDebt(e) {
  const name = e.target.className.replace("btn-debt", "").trim();
  const newDebt = prompt(`How much does ${name} owe you? `);

  addDebt(e, name, newDebt);
}

window.onload = function onload() {
  if (typeof Storage === "undefined") {
    const body = document.querySelector("body");

    for (let index = 0; index < body.children.length; index++) {
      body.removeChild(body.children[index]);
    }

    body.innerHTML =
      '<div class="warning"><p class="warning-text">Sorry, your browser is unsupported.</p></div>';
  } else {
    updateUI();
  }
};

const button = document.querySelector("#add-debt");
button.onclick = addDebt;

/* 
Q&A:

    Will the user see the debts on a different tab?  A different browser?  A different computer?
    - No. The user will only see the debts in the specific browser and computer they saved the data to,
    they will however, be able to assess the debts on a different tab.

    What happens if the browser tab is closed?  If the window is closed?
    - Nothing. Unlike session storage, the data stored in local storage persists unless
    cleared.
*/
