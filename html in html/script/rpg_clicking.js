/* =========================
   DOM
========================= */
const score = document.getElementById("score");
const click_space = document.getElementById("button-click-place");
const plus = document.getElementById("plus");

const lvClick = document.getElementById("lv");
const lvMulti = document.getElementById("lv-1");

const moneyClick = document.getElementById("money-cost");
const moneyMulti = document.getElementById("money-cost-1");

const buyButtons = document.querySelectorAll(".buy");

/* =========================
   BIẾN GAME CỐT LÕI
========================= */
let scoreValue = 0;

// click
let clickPower = 1;

// multiplier
let clickMultiple = 1;

/* =========================
   HÀM TIỆN ÍCH
========================= */
function parseMoney(el) {
    return parseInt(el.innerText.replace(/\D/g, ""), 10);
}

function getClickValue() {
    return Number((clickPower * clickMultiple).toFixed(1));
}

/* =========================
   DANH SÁCH UPGRADE
========================= */
const upgrades = [
    {
        type: "click",
        level: 1,
        count: 0,
        cost: parseMoney(moneyClick),
        levelEl: lvClick,
        costEl: moneyClick,
        apply() {
            clickPower++;
        },
        nextCost() {
            if (this.count < 10) return this.cost + 9;
            else return Math.ceil(this.cost * 1.2);
        }
    },
    {
        type: "multi",
        level: 1,
        count: 0,
        cost: parseMoney(moneyMulti),
        levelEl: lvMulti,
        costEl: moneyMulti,
        apply() {
            clickMultiple = Number((clickMultiple + 0.2).toFixed(1));
        },
        nextCost() {
            if (this.count < 10) return this.cost + 15;
            else return Math.ceil(this.cost * 1.3);
        }
    }
];

/* =========================
   CLICK CHÍNH
========================= */
click_space.addEventListener("click", (e) => {
    const gain = getClickValue();
    scoreValue = Number((scoreValue + gain).toFixed(1));

    score.textContent = `$: ${scoreValue}`;

    plus.textContent = `+${gain}`;
    plus.style.left = e.clientX - 485 + "px";
    plus.style.top = e.clientY - 40 + "px";
    plus.style.opacity = 1;
    plus.style.transform = "translateY(-20px)";

    setTimeout(() => {
        plus.style.opacity = 0;
        plus.style.transform = "translateY(0)";
    }, 700);
});

/* =========================
   MUA UPGRADE (DÙNG CHUNG)
========================= */
function buyUpgrade(index) {
    const upg = upgrades[index];
    if (scoreValue < upg.cost) return;

    scoreValue -= upg.cost;
    upg.count++;
    upg.level++;
    upg.apply();

    upg.cost = upg.nextCost();
    scoreValue = Math.floor(scoreValue);

    upg.levelEl.textContent = `level ${upg.level-1} => level ${upg.level}`;
    upg.costEl.textContent = `${upg.cost}$`;
    score.textContent = `$: ${scoreValue}`;
}

/* =========================
   GẮN BUTTON BẰNG forEach
========================= */
buyButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => buyUpgrade(index));
});

/* =========================
   AUTO CLICK (GỢI Ý NÂNG CẤP)
========================= */
setInterval(() => {
    scoreValue += getClickValue();
    score.textContent = `$: ${Math.floor(scoreValue)}`;

}, 1000);

/* =========================
   LOAD UI BAN ĐẦU
========================= */
upgrades.forEach(upg => {
    upg.levelEl.textContent = `level ${upg.level}`;
    upg.costEl.textContent = `${upg.cost}$`;
});





/*===================
    SOUND LOADING
===================*/

const sound_play = document.getElementById("sound")

sound_play.addEventListener("click", () => {

    document.getElementById("audio").play()

})



/*====================
    FETCH DATA LIST
====================*/

let item_list = "../json/items_list.json"
const store_list = document.getElementById("store")

fetch(item_list)
    .then(res => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
    })
    .then(list => {
        let data_container = "";

        list.forEach(list_data => {
            data_container += `
                <div class="purchase-items tab-release">
                    <div class="image-ex" style="background-image:url('${list_data.background}')"></div>
                    <span class="money-total">${list_data.cost}$</span>
                    <button class="btn-purchase">Purchase</button>
                </div>
            `;
        });

        store_list.innerHTML = data_container;
    })
    .catch(err => console.error("Fetch error:", err));







store_list.addEventListener("click", (e) => {
    const item = e.target.closest(".tab-release");
    if (!item) return;

    const laugh = document.getElementById("laugh_audio");
    laugh.currentTime = 0;
    laugh.play();
});
