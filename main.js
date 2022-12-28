//select elements
let main = document.querySelector(".main");
let QuesArea = document.querySelector(".QuesArea");
let AnsArea = document.querySelector(".AnsArea");
let Quescount = document.querySelector(".Quescount");
let polits = document.querySelector(".polits");
let btn = document.querySelector("button");
let footer = document.querySelector(".footer");
let timer = document.querySelector(".timer");
/********************************************/ 
//identify variables
let currindex = 0;    
let rightAns = 0;
let counter;
/****************************/
const getData = (apiLink) => {
    return new Promise((resolve, reject) => {
      let myRequest = new XMLHttpRequest();
      myRequest.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
          resolve(JSON.parse(this.responseText));
        } else {
          reject(Error("No Data Found"));
        }
      };
  
      myRequest.open("GET", apiLink,true);
      myRequest.send();
    });
  };

    getData("HTMLQuiz.json")
    .then((result) => {
      Quescount.innerHTML = result.length;
      AddData(result[currindex],result.length);
      countdown(4,result.length);
      btn.onclick = function(){
        let Ans = result[currindex].Ans;
        currindex ++;
        CheckAns(Ans);
        QuesArea.innerHTML = "";
        AnsArea.innerHTML = "";
        AddData(result[currindex],result.length);
        handlpolits();
        clearInterval(counter);
        countdown(4,result.length);
        showresult(result.length);
     }
      for (let j = 0; j < result.length; j++) {
        let span = document.createElement("span");
        if (j == currindex) {
          span.setAttribute("class","curr");
        }
        polits.appendChild(span);          
      }
    });

function AddData(obj,qcount) {
  if (currindex < qcount) {    
    let h3 = document.createElement("h3");
    h3.setAttribute("class","Ques");
    h3.innerHTML =`${obj.Que}`;
    QuesArea.appendChild(h3);
    for (let i = 0; i < obj.choices.length; i++) {
        let Ans = document.createElement("div");
        Ans.setAttribute("class","Ans")
        AnsArea.appendChild(Ans);
        let input = document.createElement("input");
        let label = document.createElement("label");
        label.textContent = obj.choices[i];
        input.setAttribute("type","radio");
        input.setAttribute("name","ques");
        input.setAttribute("id",i);
        input.dataset.answer = obj.choices[i];
        label.setAttribute("for",i);
        Ans.appendChild(input);
        Ans.appendChild(label);
    }  
  }
};

function CheckAns(Ans) {
  let choices = document.getElementsByName("ques");
  let choosenAns;
  for (let j = 0;j < choices.length; j++) {
    if (choices[j].checked) {
      choosenAns = choices[j].dataset.answer;
      console.log(choosenAns);
    }
  }
  if (Ans === choosenAns) {
    rightAns++;
console.log(rightAns);
  }
  
}

function handlpolits() {
  let polits = document.querySelectorAll(".polits span");
  let arrayofpolits = Array.from(polits);
  for (let i = 0; i < arrayofpolits.length; i++) {
    if (i == currindex) {
      arrayofpolits[i].setAttribute("class","curr");
    }
  }
}

function showresult(qcount){
  if (currindex === qcount){
    QuesArea.remove();
    AnsArea.remove();
    btn.remove();
    footer.remove();
    let div = document.createElement("div");
    let h2 = document.createElement("div");
    main.appendChild(div);
    div.appendChild(h2);
    if (rightAns >= (Quescount.innerHTML / 2)) {
      h2.innerHTML = `Pass, you answered ${rightAns} from ${Quescount.innerHTML} questions`
    }
    else {
      h2.innerHTML = `Failed, you answered ${rightAns} from ${Quescount.innerHTML} questions`
    }
    div.style.cssText = "background-color: white;height: 200px;display: flex;justify-content: center;align-items: center;font-weight: bold;font-size: larger;";
  }  

}

function countdown(duration,qcount) {
  if (currindex < qcount) {    
    let min , sec;
    counter = setInterval(function () {
      min = parseInt(duration / 60);
      sec = parseInt(duration % 60);
      min = min < 10 ? `0${min}` : min ;
      sec = sec < 10 ? `0${sec}` : sec ;
      timer.innerHTML = `${min}:${sec}`;
      if (--duration < 0) {
        clearInterval(counter);
        btn.click();
      }
    },1000)
  }
}