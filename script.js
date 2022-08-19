let tableBody = document.querySelector("tbody");
let addForm = document.body.addForm;
let productsBase;

// Заполнение таблицы
let fillRequest = fillTableRequest();

// Подключение слушателей элементов шапки таблицы.
let heads = document.querySelectorAll("th");
for(head of heads) {
    head.addEventListener("click",sorting);
}

// Функция создания запроса на обновление данных в таблице 
function fillTableRequest() {
    let request = new XMLHttpRequest();
    request.onload = function() {
        if(request.status === 200) {
            productsBase = JSON.parse(request.response);
            fillTable(productsBase);
        } else {
            console.log("Ошибка при загрузке");
        }
    }
    request.open('GET', 'dataOutput.php');
    request.send();
    return request;
}

// Функция заполнения таблицы данными
function fillTable(products = null) {
    clearTable();
    if (!products.length || !products) {
        console.log("В базе данных продуктов нет!");
        return;
    }
    let newRow;
    let title_temp ="";
    let total = 0,count = 0;
    for(product of products) {
        total+=(product["price"]*product["amount"]);
        count += product["amount"]*1;
        newRow = document.createElement("tr");
        for(key in product) {
            newRow.innerHTML+="<td>"+product[key]+"</td>";
            title_temp+=key + ": " + product[key] + "\r";
        }
        newRow.addEventListener("click", deleteProduct);
        newRow.setAttribute("title",title_temp);
        title_temp = "";
        tableBody.appendChild(newRow);
    }
    document.getElementById("total").innerText = total;
    document.getElementById("count").innerText = count;
}

// Функция очистки таблицы
function clearTable(){
    document.querySelector("tbody").innerHTML = "";
    document.getElementById("total").innerText = 0;
}

// Функция 'ActionListener' для строк таблицы.
// Выводит окно для подтверждение удаления
// и запускает функцию запроса на удаление 
function deleteProduct(e) {
    if(confirm("Удалить '" + e.target.parentNode.innerText + "'?")) {
        deleteProductRequest(e.target.parentNode);
    } else {
        return false;
    }
}

// Функция создания запроса на удаление.
// Также, обновляет таблицу
function deleteProductRequest(node) {
    if(!node) {
        console.log("Ошибка удаления элемента");
        return false;
    }
    let removable = [];
    let request = new XMLHttpRequest();
    request.onload = function() {
        if (request.status === 200) {
            alert(request.response);
        } else {
            console.log("Ошибка при запросе удаления");
        }
    }

    for (child of node.childNodes) {
        removable.push(child.innerText);
    }
    
    request.open("POST","deleteData.php");
    request.setRequestHeader("Content-Type","application/json");
    let data = JSON.stringify(removable);
    request.send(data);
    fillTableRequest();

}

// Функция сортировки Элементов в сохраненном массиве.
function sorting(e) {
    if(!productsBase.length) return false;
    let base = productsBase;
    let order = (e.target.dataset.order = -(e.target.dataset.order ||-1));
    let index = [...e.target.parentNode.cells].indexOf(e.target);
    let key;
    switch(index) {
        case 0: key = "manufacturer"; break;
        case 1: key = "name"; break;
        case 2: key = "price"; break;
        case 3: key = "amount"; break;
        default: alert("Ошибка!");
    };
    let collator = new Intl.Collator(undefined, {numeric: true})
    base.sort((a,b) => order*collator.compare(a[key],b[key]));
    fillTable(base);
}

function submitAction(event) {
    let texts = document.querySelectorAll('form [type="text"]');
    let nums = document.querySelectorAll('form [type="number"]');
    //wordsExpEng - не поддерживает кириллицу
    let wordsExpEng = /^\w+(\s\w+)*$/;
    let wordsExp = /^[а-яА-ЯёЁa-zA-Z0-9]+(\s[а-яА-ЯёЁa-zA-Z0-9]+)*$/;
    
    if (
        (wordsExp.test(texts[0].value)) && 
        (wordsExp.test(texts[1].value)) && 
        (/\d+/.test(nums[0].value)) &&
        (/\d+/.test(nums[1].value)) ) {

        event.submit();
    } else {
        alert("Введены неправильные данные");
    }
}