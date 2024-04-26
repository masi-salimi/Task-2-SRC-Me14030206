const btn = document.querySelector(".btn");
const searchBox = document.querySelector("#search");
const h1 = document.querySelector("#h1");
const transactionsDOM = document.querySelector(".transactions-center");

let allTransactions = [];
let result = "";
const filters = {
  searchItems: "",
};

let sortType = "desc";

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
    .get(
      "http://localhost:3000/transactions?refId_like =" + filters.searchItems
    )
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
    <th class="trans-price psort">مبلغ
   <span  class="psort">
    <i class="fa fa-chevron-down iprice"></i>
     </span>
    </th>
    <th class="trans-refId">شماره پیگیری</th>
    <th class="trans-date dsort">تاریخ تراکنش
    <span class="dsort">
    <i class="fa fa-chevron-down idate"></i>
     </span>
    </th>     
    </tr>
    ` +
      result +
      `</table>`;
    transactionsDOM.appendChild(transDiv);
    const ipTag = document.querySelector(".iprice");
    if (sortType == "asc") ipTag.classList.add("rotated");
    else ipTag.classList.remove("rotated");

    const idTag = document.querySelector(".idate");
    if (sortType == "asc") idTag.classList.add("rotated");
    else idTag.classList.remove("rotated");

    const psort = document.querySelector(".psort");
    const dsort = document.querySelector(".dsort");

    psort.addEventListener("click", sortFunction);
    dsort.addEventListener("click", sortFunction);
  });
}

function sortFunction() {
  let sortData = "price";
  if (this.classList.contains("dsort")) sortData = "date";
  sortType = this.children[0].children[0].classList.contains("rotated")
    ? "desc"
    : "asc";
  if (sortType == "asc") this.children[0].children[0].classList.add("rotated");
  else this.children[0].children[0].classList.remove("rotated");

  axios
    .get(
      "http://localhost:3000/transactions?_sort=" +
        sortData +
        "&_order=" +
        sortType
    )
    .then((res) => {
      allTransactions = res.data;
      renderTrans(allTransactions, filters);
    })
    .catch((err) => console.log(err));
}
