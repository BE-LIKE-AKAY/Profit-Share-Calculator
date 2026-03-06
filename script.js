let names=[]
let profits=[]
let chart

function addPartner(){

let div=document.createElement("div")
div.className="partner"

div.innerHTML=`
<img width="35" src="https://api.dicebear.com/7.x/identicon/svg?seed=${Math.random()}">
<input placeholder="Name">
<input type="number" placeholder="Investment">
<input type="number" placeholder="Years">
`

document.getElementById("partners").appendChild(div)

}

addPartner()
addPartner()

function calculate(){

let partners=document.querySelectorAll(".partner")
let totalProfit=parseFloat(document.getElementById("profit").value)

names=[]
profits=[]

let weights=[]
let totalWeight=0

partners.forEach(p=>{

let i=p.querySelectorAll("input")

let name=i[0].value||"Investor"
let invest=parseFloat(i[1].value)||0
let years=parseFloat(i[2].value)||0

let w=invest*years

weights.push(w)
names.push(name)

totalWeight+=w

})

let html=""

weights.forEach((w,i)=>{

let share=(w/totalWeight)*totalProfit
profits.push(share)

let percent=(w/totalWeight)*100

html+=`
<div class="result">
<b>${names[i]}</b> → ₹${share.toFixed(2)}
<div class="bar" style="width:${percent}%"></div>
</div>
`

})

document.getElementById("results").innerHTML=html

drawChart()

saveHistory()

}

function drawChart(){

let ctx=document.getElementById("chart")

if(chart) chart.destroy()

chart=new Chart(ctx,{
type:"doughnut",
data:{
labels:names,
datasets:[{
data:profits,
backgroundColor:["#00ffff","#ff00ff","#ffaa00","#00ff88","#ffd500"]
}]
}
})

}

function exportJSON(){

let data={names,profits}

let blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"})
let a=document.createElement("a")

a.href=URL.createObjectURL(blob)
a.download="profit.json"
a.click()

}

function exportCSV(){

let csv="Name,Profit\n"

names.forEach((n,i)=>{
csv+=`${n},${profits[i]}\n`
})

let blob=new Blob([csv],{type:"text/csv"})
let a=document.createElement("a")

a.href=URL.createObjectURL(blob)
a.download="profit.csv"
a.click()

}

function shareLink(){

let data=btoa(JSON.stringify({names,profits}))

let link=location.origin+location.pathname+"?data="+data

navigator.clipboard.writeText(link)

alert("Share link copied")

}

function saveHistory(){

let history=JSON.parse(localStorage.getItem("history")||"[]")

history.push({names,profits,date:new Date().toLocaleString()})

localStorage.setItem("history",JSON.stringify(history))

renderHistory()

}

function renderHistory(){

let history=JSON.parse(localStorage.getItem("history")||"[]")

let html="<h3>History</h3>"

history.reverse().forEach(h=>{
html+=`<div class="result">${h.date}</div>`
})

document.getElementById("history").innerHTML=html

}

renderHistory()

tsParticles.load("particles",{
particles:{
number:{value:80},
size:{value:3},
move:{enable:true,speed:1},
color:{value:["#00ffff","#ff00ff","#ffffff"]}
}
})
