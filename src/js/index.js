const btn = document.querySelector(".btn");
const searchBox = document.querySelector("#search");
const h1 = document.querySelector("#h1");
const transactionsDOM = document.querySelector(".transactions-center");

let allTransactions = [];
let result = "";
const filters = {
  searchItems: "",
};
let sign = 1;
let price = "price";

let signd = 1;
let date = "date";

document.addEventListener("DOMContentLoaded", () => {
    allTransactions = [];
    renderTrans(allTransactions, filters);
});

btn.addEventListener("click", () => {
  btn.classList.add("hidden");
  axios
    .get("http://localhost:3000/transactions")
    .then((res) => {
      allTransactions = res.data;
      searchBox.classList.remove("hidden");
      renderTrans(allTransactions, filters);
    })
    .catch((err) => console.log(err));
});

searchBox.addEventListener("input", (e) => {
  filters.searchItems = e.target.value;
  axios
    .get("http://localhost:3000/transactions?refId_like =" + filters.searchItems)
    .then((res) => {
      allTransactions = res.data;
      console.log(allTransactions);
      renderTrans(allTransactions, filters);
    })
    .catch((err) => console.log(err));
});

function renderTrans(_trans, _filters) {
  const filteredTrans = _trans.filter((t) => {
    return String(t.refId).includes(_filters.searchItems);
  });

  transactionsDOM.innerHTML = "";
  result = "";
  const transDiv = document.createElement("div");
  transDiv.classList.add("trnas");
  filteredTrans.forEach((item, index) => {
    result += `       
      <tr class="trans-list">
        <td class="trans-row">${item.id}</td>
        <td class="trans-type">${item.type.trim()}</td>
        <td class="trans-price">${item.price}</td>
        <td class="trans-refId">${item.refId}</td>
        <td class="trans-date">${new Date(item.date).toLocaleString(
          "fa-IR"
        )}</td>      
           </tr>`;
    transDiv.innerHTML =
      `
    <div class="trans-title">
    لیست تراکنشهای شما
    </div>
  
    <table>
    <tr class="trans-header">
    <th class="trans-row">ردیف</th>
    <th class="trans-type">نوع تراکنش</th>
    <th class="trans-price">مبلغ
   <span  class="psort">
    <i class="fa fa-chevron-down iprice"></i>
     </span>
    </th>
    <th class="trans-refId">شماره پیگیری</th>
    <th class="trans-date">تاریخ تراکنش
    <span class="dsort">
    <i class="fa fa-chevron-down idate"></i>
     </span>
    </th>     
    </tr>
    ` +
      result +
      `</table>`;
    transactionsDOM.appendChild(transDiv);
    const psort = document.querySelector(".psort");
    const dsort = document.querySelector(".dsort");

     psort.addEventListener("click", sortFunctionp);
     dsort.addEventListener("click", sortFunctiond);
  });
}

function sortFunctionp() {
  sign *= -1;
  price = sign > 0 ? "-price" : "price";
  axios
    .get("http://localhost:3000/transactions?_sort=" + price)
    .then((res) => {
      allTransactions = res.data;
      renderTrans(allTransactions, filters);
      const iTag = document.querySelector(".iprice");
      if (sign < 0) iTag.classList.add("rotated");
      else iTag.classList.remove("rotated");
    })
    .catch((err) => console.log(err));
}

function sortFunctiond() {
  signd *= -1;
  date = signd > 0 ? "-date" : "date";
  axios
    .get("http://localhost:3000/transactions?_sort=" + date)
    .then((res) => {
      allTransactions = res.data;
      renderTrans(allTransactions, filters);
      const iTag = document.querySelector(".idate");
      if (signd < 0) iTag.classList.add("rotated");
      else iTag.classList.remove("rotated");
    })
    .catch((err) => console.log(err));
}
