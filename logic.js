const{ipcRenderer,dialog }=require("electron");
var xlsx = require("xlsx");
const { Client } = require('pg');
const { NULL } = require("xlsx-populate/lib/FormulaError");
const okButton = document.getElementById('okButton');
const okButton_2 = document.getElementById('okButton_2');
const cancelButton = document.getElementById('cancelButton');
const nothingSelectedModal = document.getElementById('confirmationModal');
const confirmationText = document.getElementById('confirmationText');
const closeButton = document.querySelector('.close');
const confirmationModal = document.getElementById('confirmationModal');
const img_email = document.getElementById('img_email');
const img_mess = document.getElementById('img_mess');
const cancelButton_2 = document.getElementById('cancelButton_2');

closeButton.addEventListener('click', () => {
  nothingSelectedModal.style.display = 'none';
  document.body.classList.remove('modal-open');
});

cancelButton.addEventListener('click', () => {
  nothingSelectedModal.style.display = 'none';
  document.body.classList.remove('modal-open');
});
let email_id = "";

cancelButton_2.addEventListener('click', () => {
  nothingSelectedModal.style.display = 'none';
  img_email.style.display = 'none';
  document.body.classList.remove('modal-open');
  console.log("email_id = ", email_id);
  document.getElementById(`${email_id}`).value = "";
});
// ----------------------------------------------------------------
const table = document.getElementById("myTable");
let Name_DB;
let Password_DB;
let User;
let Ip;
let Port;
function createDate(datta){
  let ss = `${datta}`;
  let sss = ss.split(' ');
  const monthDictionary = {
    "Jan": "01",
    "Feb": "02",
    "Mar": "03",
    "Apr": "04",
    "May": "05",
    "Jun": "06",
    "Jul": "07",
    "Aug": "08",
    "Sep": "09",
    "Oct": "10",
    "Nov": "11",
    "Dec": "12"
  };
  const monthValue = sss[1];
  if (monthDictionary.hasOwnProperty(monthValue)) {
    sss[1] = monthDictionary[monthValue];
  }
  let str_date = `${sss[3]}-${sss[1]}-${sss[2]}`;
  return str_date;
}
// ---------Начальная загрузка--------------------------------------------------------------
function oneSelectFun(values){
  // Name_DB = values.input1;
  Name_DB = 'postgres';
  Password_DB = values.passwordInput;
  User = values.loginInput;
  Port = 5432;
  Ip = 'localhost';
  // ------------------------------
const client = new Client({
  user: User,
  host: Ip,
  database: Name_DB,
  password: Password_DB,
  port: Port, // порт PostgreSQL
});
client.connect();
client.query('SELECT * FROM cadet', (err, res) => {
  console.log(err ? err.stack : res.rows);
  if(err){
    console.log(err)
  }
  else{
    let data = res.rows;
    for(let i=0;i<res.rowCount;i++){
      // Create a new row
    const newRow = table.insertRow();
  
    const nameCell = newRow.insertCell();
    const rangCell = newRow.insertCell();
    const otdelCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const ageCell = newRow.insertCell();
    const workCell = newRow.insertCell();
    const telCell = newRow.insertCell();
    const emailCell = newRow.insertCell();
    const learnCell = newRow.insertCell();
    const selaryCell = newRow.insertCell();
// ---------------Стрелочки с увеличением---------------------------------------------
    const input_salary = document.createElement('input');
    input_salary.className = 'salary_class';
    input_salary.id = `salary_id${i+1}`;
    input_salary.type = 'number';
    input_salary.step = '0.01'; // Здесь можно указать нужный вам шаг
    input_salary.min = '16.21';
    input_salary.value = data.at(i).salary;
    if(input_salary.value < input_salary.min){
      input_salary.value = '';
    }
    else{
      input_salary.value = data.at(i).salary;
    }

    selaryCell.appendChild(input_salary);


    ageCell.readOnly = true;
    ageCell.className = 'age_class';
    ageCell.id = `age_id${i+1}`;
    ageCell.step = '1'; 
    ageCell.min = '18';
    ageCell.max = '65';
    let yy_date = `${data.at(i).date_b}`;
    let yy_arr = yy_date.split(' ');
    let yy = yy_arr[3];
    const currentYear = new Date().getFullYear();
    ageCell.textContent = currentYear - yy;
    let val_age = currentYear - yy;
    if(val_age > '65' || val_age <'18'){
      ageCell.value = '';
    }
    else {
      ageCell.value = currentYear - yy;
    }

    const input_work = document.createElement('input');
    input_work.className = 'work_class';
    input_work.id = `work_id${i+1}`;
    input_work.type = 'number';
    input_work.step = '1'; // Здесь можно указать нужный вам шаг
    input_work.min = '0';
    input_work.max = `${ageCell.value - 18}`;
    input_work.value = data.at(i).workk;
    if(input_work.value > (ageCell.value - 18)){
      input_work.value = input_work.max;
    }
    else if(input_work.value < input_work.min){
      input_work.value = null;
    }
    else{
      input_work.value = data.at(i).workk;
    }
    workCell.appendChild(input_work);
// --------------------------------------------------
    const actionsCell = newRow.insertCell();
  
    nameCell.contentEditable = true;
    // --------Дата----------------------------------------------
      const input = document.createElement('input');
      input.type = 'date';
      input.className = 'date_class';
      input.id = `date_id${i+1}`;

      const currentDate = new Date(); // Get the current date
      const newDateMin = new Date();
      const newDateMax = new Date();
      newDateMin.setFullYear(currentDate.getFullYear() - 70); 
      newDateMax.setFullYear(currentDate.getFullYear() - 18); 

      input.min = createDate(newDateMin);
      input.max = createDate(newDateMax);

      const selectedDate = createDate(`${data.at(i).date_b}`);

        if ((selectedDate < createDate(newDateMin)) || (selectedDate > createDate(newDateMax))) {
          input.value = '';
          input_work.value = '';
          input_work.style.display = "none";

          ageCell.textContent = '';
          ageCell.value = '';
        }
        else{
          input_work.style.display = "";
          input.value = createDate(`${data.at(i).date_b}`);
        }

  
      dateCell.appendChild(input);

    nameCell.textContent = data.at(i).fio;

    // -----------Должность-------------------------------------------
    {
      const select_rang = document.createElement('select');
      const options_rang = ['','Менеджер', 'Экономист', 'Оператор', 'Начальник отдела', 'Кассир', 'Бухгалтер', 'Секретарь', 'Юрист'];
      options_rang.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.text = optionValue;
          // Устанавливаем начальное значение
        if (optionValue === data.at(i).rang) {
          option.selected = true;
        }
        select_rang.appendChild(option);
      });    
      rangCell.appendChild(select_rang)
    }
    // --------Отдел----------------------------------------------
    {
      const select_otdel = document.createElement('select');
      const options_otdel = ['','Отдел закупок','Отдел продаж','Планово-экономический','Бухгалтерия','Юридический','Логистический'];
      options_otdel.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.text = optionValue;
              // Устанавливаем начальное значение
        if (optionValue === data.at(i).otdel) {
          option.selected = true;
        }
        select_otdel.appendChild(option);
        });    
      otdelCell.appendChild(select_otdel)
    }
    // -----------Образование-------------------------------------------
    {
      const select_learn = document.createElement('select');
      const options_learn = ['','Среднее спец.','Высшее','Среднее'];
      options_learn.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.text = optionValue;
          // Устанавливаем начальное значение
        if (optionValue === data.at(i).learn) {
          option.selected = true;
        }
        select_learn.appendChild(option);
        });    
      learnCell.appendChild(select_learn)
    }
// -------------Проверка номера тел--------------------
    const input_tel = document.createElement('input');
    input_tel.type = 'text';
    input_tel.placeholder = "+7 (999) 999 99 99";
    input_tel.id = `tel_id${i+1}`;
    input_tel.value = data.at(i).tel;

    telCell.appendChild(input_tel);

    $(document).ready(function() {
      $(`#tel_id${i+1}`).mask("+7 (999) 999-99-99");
    });

    if (input_tel.value == "") {
      console.log("Некорректное значение")
    } 
  // -------------Проверка номера почты--------------------
    const input_email = document.createElement('input');
    input_email.type = 'text';
    input_email.placeholder = "param@gmail.com";
    input_email.className = 'email_class';
    input_email.id = `email_id${i+1}`;
    input_email.value = data.at(i).email;

    emailCell.appendChild(input_email);

  // ----------------------------------------------------
    

      actionsCell.textContent = " ";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("deleteRowCheckbox");
      checkbox.id = `id_check${i}`;
      actionsCell.appendChild(checkbox);

    }
    client.end();
  }
});
}
ipcRenderer.on('initialFormValues', (event, values) => {
  oneSelectFun(values)
});

// -----------Фокус ячейки----------------------------------------------------------------
  function updateTableArray() {
    let input_blur_focus = document.querySelectorAll(".email_class");
    img_mess.style.display = 'none';
    okButton.style.display = 'none';
    cancelButton.style.display = 'none';

    for(let r=0;r<input_blur_focus.length;r++){
      console.log(r);
      let input_em = document.getElementById(`email_id${r+1}`);
      const emal_21 = input_em.value || ""; 
      if(emal_21 == ""){
        continue;
      }else if(!emal_21.match(/^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]{2,3}$/)){
          console.log('Пожалуйста, введите правильный email.');
          email_id = input_em.id;

          document.body.classList.add('modal-open');
          confirmationText.textContent = `Некорректное значение '${input_em.value}' для E-mail, хотите удалить строку из таблицы?`;
          nothingSelectedModal.style.display = 'block';
          cancelButton_2.style.display = '';
          okButton_2.style.display = '';
          img_email.style.display = '';
        }
        else{
          console.log('правильный email.');
        }
    }
    // -----------------------------------------------
    let data_blur_focus = document.querySelectorAll("td input[type='date']");

      const currentDate = new Date(); // Get the current date
      const newDateMin = new Date();
      const newDateMax = new Date();
      newDateMin.setFullYear(currentDate.getFullYear() - 70); 
      newDateMax.setFullYear(currentDate.getFullYear() - 18);
 
    for(let i=0;i<data_blur_focus.length;i++){
      console.log(i+1);
      let input_da = document.getElementById(`date_id${i+1}`);

      if ((input_da.value < createDate(newDateMin)) || (input_da.value > createDate(newDateMax))) {
        document.getElementById(`date_id${i+1}`).value = "";
        document.getElementById(`age_id${i+1}`).textContent = " ";
        document.getElementById(`work_id${i+1}`).value = "";
        document.getElementById(`work_id${i+1}`).style.display = "none"; 
      }
      else{
        const currentYear = new Date().getFullYear();
        let yy_date = input_da.value;
        let yy = yy_date.split('-');

        document.getElementById(`age_id${i+1}`).textContent = currentYear - yy[0];
        document.getElementById(`work_id${i+1}`).style.display = "";
        document.getElementById(`work_id${i+1}`).max = (currentYear - yy[0]) - 18;
        if(document.getElementById(`work_id${i+1}`).value > document.getElementById(`work_id${i+1}`).max){
          document.getElementById(`work_id${i+1}`).value = document.getElementById(`work_id${i+1}`).max;
        }
        if(document.getElementById(`work_id${i+1}`).value < 0){
          document.getElementById(`work_id${i+1}`).value = "";
        }
      }
    }
    let salary_fucus = document.querySelectorAll(".salary_class");
    for(let i=0;i<salary_fucus.length;i++){
      let input_sa = document.getElementById(`salary_id${i+1}`);
       if(input_sa.value < 16.21){
        document.getElementById(`salary_id${i+1}`).value = "";
      }
    }
    // ----------------------------------------------------------------------
    const new_arr = [];
  
    for (var i = 0; i < table.rows.length; i++) {
      var row = table.rows[i];
      var rowData = [];
      for (var j = 0; j < row.cells.length; j++) {
        var cell = row.cells[j];
        // ------------------------------------------------------------------     
      if (cell.firstChild && cell.firstChild.nodeName === 'SELECT') {
        const select = cell.firstChild;
        const selectedValue = select.value;
        rowData.push(selectedValue);
      } 
      else if (cell.firstChild && cell.firstChild.nodeName === 'INPUT' && cell.firstChild.type === 'date') {
        const dateInput = cell.firstChild;
        const dateValue = dateInput.value;
        rowData.push(dateValue);
      }
      // --------------------------------
      else if (cell.firstChild && cell.firstChild.nodeName === 'INPUT' && cell.firstChild.type === 'number') {
        const dateInput = cell.firstChild;
        const dateValue = dateInput.value;
        rowData.push(dateValue);
      }
      // --------------------------------
      else if (cell.firstChild && cell.firstChild.nodeName === 'INPUT' && cell.firstChild.type === 'text') {
        const dateInput = cell.firstChild;
        const dateValue = dateInput.value;
        rowData.push(dateValue);
      }
      else {
        rowData.push(cell.innerText);
      }
      
      }
      new_arr.push(rowData);
    }
      var values_ins = "";
      for(let i=1;i<new_arr.length;i++){
        values_ins+="(";
        for (let j = 0; j < 10; j++) {
          if (new_arr.at(i).at(j) === ' ' || new_arr.at(i).at(j) === '' || new_arr.at(i).at(j) === 'Некорректное значение') {
            if(j == 9){
              values_ins += `${null}`;
            }
            else{
              values_ins += `${null},`;
            }
          } else if (j === 0 || j === 1 || j === 2 || j === 3 || j === 6 || j === 7 || j === 8) {
            values_ins += `'${new_arr.at(i).at(j)}',`;
          }  
          else if(j == 9){
            values_ins += `${new_arr.at(i).at(j)}`;
          }
          else{
            values_ins += `${new_arr.at(i).at(j)},`;
          }
        }
        values_ins += '),';
        if (i === new_arr.length - 1) {
          values_ins = values_ins.slice(0, -1);
          values_ins = values_ins.slice(0, -1);
          values_ins += ')';
        }
      }

     
    console.log(`INSERT INTO cadet (fio, rang, otdel, date_b, age,workk, tel, email, learn, salary) VALUES ${values_ins}`)
      const client = new Client({
        user: User,
        host: Ip,
        database: Name_DB,
        password: Password_DB,
        port: Port, // порт PostgreSQL
      });
      client.connect()
        .then(() => {
          console.log('Connected to database');
          return client.query('DROP TABLE cadet');
        })
        .then(result1 => {
          return client.query('CREATE TABLE cadet (id serial primary key,fio varchar(50), rang varchar(50), otdel varchar(50),date_b date,age int ,workk int,tel varchar(50),email varchar(50),learn varchar(50),salary float)');
        })
        .then(result2 => {
          return client.query(`INSERT INTO cadet (fio, rang, otdel, date_b, age,workk, tel, email, learn, salary) VALUES ${values_ins};`);
        })
        .catch(err => console.error('Error executing query', err))
        .finally(() => {
          client.end();
          console.log('Connection closed');
        });


    const checkboxes = document.querySelectorAll('.deleteRowCheckbox');

    for(let r = 0;r<checkboxes.length;r++){
      let checkbox = checkboxes[r];
      const row = checkbox.parentNode.parentNode;
      const selectElements = row.querySelectorAll("td select");
      const selectDate = row.querySelectorAll("td input[type='date']");
      const selectInput = row.querySelectorAll("td input[type='number']");
      const selectText = row.querySelectorAll("td input[type='text']");


      if (checkbox.checked) {
        row.style.backgroundColor = "#e9e5e5";
        selectElements.forEach(function(select) {
          select.style.backgroundColor = "#e9e5e5";
        });
        selectDate.forEach(function(select) {
          select.style.backgroundColor = "#e9e5e5";
        }); 
        selectInput.forEach(function(select) {
          select.style.backgroundColor = "#e9e5e5";
        });
        selectText.forEach(function(select) {
          select.style.backgroundColor = "#e9e5e5";
        });  
     
      }
      else {
        row.style.backgroundColor = "";
        selectElements.forEach(function(select) {
          select.style.backgroundColor = "";
        });  
        selectDate.forEach(function(select) {
          select.style.backgroundColor = "";
        });   
        selectInput.forEach(function(select) {
          select.style.backgroundColor = "";
        });
        selectText.forEach(function(select) {
          select.style.backgroundColor = "";
        });   
      }
    }  
        
    }

// ----------Select--------------------------------------------------------------------------------
function myFunction_select() {
  function clearTable() {
    const table = document.getElementById("myTable");
    const rowCount = table.rows.length;
  
    for (let i = rowCount - 1; i > 0; i--) {
      table.deleteRow(i);
    }
  } 

  clearTable();
  const client = new Client({
    user: User,
    host: Ip,
    database: Name_DB,
    password: Password_DB,
    port: Port, // порт PostgreSQL
  });
  client.connect();
  client.query('SELECT * FROM cadet', (err, res) => {
    if(err){
      console.log(err)
    }
    else{
    let data = res.rows;
    for(let i=0;i<res.rowCount;i++){
       // Create a new row
     const newRow = table.insertRow();
   
    const nameCell = newRow.insertCell();
    const rangCell = newRow.insertCell();
    const otdelCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const ageCell = newRow.insertCell();
    const workCell = newRow.insertCell();
    const telCell = newRow.insertCell();
    const emailCell = newRow.insertCell();
    const learnCell = newRow.insertCell();
    const selaryCell = newRow.insertCell();
// ------------------------------------------------
// ---------------Стрелочки с увеличением---------------------------------------------
const input_salary = document.createElement('input');
input_salary.className = 'salary_class';
input_salary.id = `salary_id${i+1}`;
input_salary.type = 'number';
input_salary.step = '0.01'; // Здесь можно указать нужный вам шаг
input_salary.min = '16.21';
input_salary.value = data.at(i).salary;
if(input_salary.value < input_salary.min){
  input_salary.value = '';
}
else{
  input_salary.value = data.at(i).salary;
}
selaryCell.appendChild(input_salary);


  ageCell.readOnly = true; // Make the input read-only
  ageCell.className = 'age_class';
  ageCell.id = `age_id${i+1}`;
  ageCell.step = '1'; // Здесь можно указать нужный вам шаг
  ageCell.min = '18';
  ageCell.max = '65';
  let yy_date = `${data.at(i).date_b}`;
  let yy_arr = yy_date.split(' ');
  let yy = yy_arr[3];
  console.log(yy)
  const currentYear = new Date().getFullYear();
  ageCell.textContent = currentYear - yy;
  ageCell.value = currentYear - yy;
  let val_age = currentYear - yy;
  if(val_age > '65' || val_age <'18'){
    ageCell.value = '';
  }
  else {
    ageCell.value = currentYear - yy;
  }

  const input_work = document.createElement('input');
  input_work.className = 'work_class';
  input_work.id = `work_id${i+1}`;
  input_work.type = 'number';
  input_work.step = '1'; // Здесь можно указать нужный вам шаг
  input_work.min = '0';
  input_work.max = `${ageCell.value - 18}`;
  input_work.value = data.at(i).workk;
  if(input_work.value > (ageCell.value - 18)){
    input_work.value = input_work.max;
  }
  else if(input_work.value < input_work.min){
    input_work.value = null;
  }
  else{
    input_work.value = data.at(i).workk;
  }


  workCell.appendChild(input_work);
// --------------------------------------------------

  const actionsCell = newRow.insertCell();
  nameCell.contentEditable = true;
   // ------------------------------------------------------
   const input = document.createElement('input');
   input.type = 'date';
   input.className = 'date_class';
   input.id = `date_id${i+1}`;

   const currentDate = new Date(); // Get the current date
   const newDateMin = new Date();
   const newDateMax = new Date();
   newDateMin.setFullYear(currentDate.getFullYear() - 70); 
   newDateMax.setFullYear(currentDate.getFullYear() - 18); 

   input.min = createDate(newDateMin);
   input.max = createDate(newDateMax);

   const selectedDate = createDate(`${data.at(i).date_b}`);

     if ((selectedDate < createDate(newDateMin)) || (selectedDate > createDate(newDateMax))) {
       input.value = '';
       input_work.value = '';
       input_work.style.display = "none";

       ageCell.textContent = '';
       ageCell.value = '';
     }
     else{
      input_work.style.display = "";
       input.value = createDate(`${data.at(i).date_b}`);
     }


   dateCell.appendChild(input);


  nameCell.textContent = data.at(i).fio;

      // ------------------------------------------------------
      const select_rang = document.createElement('select');
      const options_rang = ['','Менеджер', 'Экономист', 'Оператор', 'Начальник отдела', 'Кассир', 'Бухгалтер', 'Секретарь', 'Юрист'];
      options_rang.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.text = optionValue;
          // Устанавливаем начальное значение
        if (optionValue === data.at(i).rang) {
          option.selected = true;
        }
        select_rang.appendChild(option);
      });    
      rangCell.appendChild(select_rang)
      // ------------------------------------------------------
        // --------Отдел----------------------------------------------
        const select_otdel = document.createElement('select');
        const options_otdel = ['','Отдел закупок','Отдел продаж','Планово-экономический','Бухгалтерия','Юридический','Логистический'];
        options_otdel.forEach(optionValue => {
          const option = document.createElement('option');
          option.value = optionValue;
          option.text = optionValue;
            // Устанавливаем начальное значение
          if (optionValue === data.at(i).otdel) {
            option.selected = true;
          }
          select_otdel.appendChild(option);
        });    
        otdelCell.appendChild(select_otdel)
        // ------------------------------------------------------
    // -----------Образование-------------------------------------------
    const select_learn = document.createElement('select');
    const options_learn = ['','Среднее спец.','Высшее','Среднее'];
    options_learn.forEach(optionValue => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.text = optionValue;
        // Устанавливаем начальное значение
      if (optionValue === data.at(i).learn) {
        option.selected = true;
      }
      select_learn.appendChild(option);
      });    
    learnCell.appendChild(select_learn)
    // ------------------------------------------------------

  // -------------Проверка номера тел--------------------
  const input_tel = document.createElement('input');
  input_tel.type = 'text';
  input_tel.placeholder = "+7 (999) 999 99 99";
  input_tel.id = `tel_id${i+1}`;
  input_tel.value = data.at(i).tel;

  telCell.appendChild(input_tel);

  $(document).ready(function() {
    $(`#tel_id${i+1}`).mask("+7 (999) 999-99-99");
  });

  if (input_tel.value == "") {
    console.log("Некорректное значение")
  } 
// -------------Проверка номера почты--------------------
    const input_email = document.createElement('input');
    input_email.type = 'text';
    input_email.placeholder = "param@gmail.com";
    input_email.className = 'email_class';
    input_email.id = `email_id${i+1}`;
    input_email.value = data.at(i).email;

    emailCell.appendChild(input_email);
  // ----------------------------------------------------

      actionsCell.textContent = " ";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("deleteRowCheckbox");
      checkbox.id = `id_check${i}`;
      actionsCell.appendChild(checkbox);
      
    }
    client.end();
    }
  });
  console.log('Функция сработала!');
}
{
  
   const addRowBtn = document.getElementById("addRowBtn");
   addRowBtn.addEventListener("click", () => {
     const newRow = table.insertRow();
   
      const nameCell = newRow.insertCell();
      const rangCell = newRow.insertCell();
      const otdelCell = newRow.insertCell();
      const dateCell = newRow.insertCell();
      const ageCell = newRow.insertCell();
      const workCell = newRow.insertCell();
      const telCell = newRow.insertCell();
      const emailCell = newRow.insertCell();
      const learnCell = newRow.insertCell();
      const selaryCell = newRow.insertCell();
  
     const actionsCell = newRow.insertCell();
   
      nameCell.contentEditable = true;
        // ------------------------------------------------------
      const rowCount = table.rows.length -2 ;
      const input = document.createElement('input');
      input.type = 'date';
      input.className = 'date_class';
      input.id = `date_id${rowCount+1}`;
  
      const currentDate = new Date(); // Get the current date
      const newDateMin = new Date();
      const newDateMax = new Date();
      newDateMin.setFullYear(currentDate.getFullYear() - 70); 
      newDateMax.setFullYear(currentDate.getFullYear() - 18); 
  
      input.min = createDate(newDateMin);
      input.max = createDate(newDateMax);

      dateCell.appendChild(input);

// ---------------Стрелочки с увеличением---------------------------------------------
    const input_salary = document.createElement('input');
    input_salary.className = 'salary_class';
    input_salary.id = `salary_id${rowCount+1}`;
    input_salary.type = 'number';
    input_salary.step = '0.01'; // Здесь можно указать нужный вам шаг
    input_salary.min = '16.21';
    selaryCell.appendChild(input_salary);

    ageCell.readOnly = true; // Make the input read-only
    ageCell.className = 'age_class';
    ageCell.id = `age_id${rowCount+1}`;

    ageCell.step = '1'; // Здесь можно указать нужный вам шаг
    ageCell.min = '18';
    ageCell.max = '65';

    ageCell.textContent = '';
    ageCell.value = '';

    const input_work = document.createElement('input');
    input_work.style.display = "none";
    input_work.className = 'work_class';
    input_work.id = `work_id${rowCount+1}`;
    input_work.type = 'number';
    input_work.step = '1'; // Здесь можно указать нужный вам шаг
    input_work.min = '0';
    if(input_work.value == ''){
      input_work.max = '0';
    }
    else{
      input_work.max = `${ageCell.value - 18}`;
    }
    input_work.value = '';
    workCell.appendChild(input_work);
// --------------------------------------------------
  
      nameCell.textContent = '';
          // ------------------------------------------------------
    const select_rang = document.createElement('select');
    const options_rang = ['','Менеджер', 'Экономист', 'Оператор', 'Начальник отдела', 'Кассир', 'Бухгалтер', 'Секретарь', 'Юрист'];
    options_rang.forEach(optionValue => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.text = optionValue;
        // Устанавливаем начальное значение
      if (optionValue === '') {
        option.selected = true;
      }
      select_rang.appendChild(option);
    });    
    rangCell.appendChild(select_rang)
    // ------------------------------------------------------
            // --------Отдел----------------------------------------------
            const select_otdel = document.createElement('select');
            const options_otdel = ['','Отдел закупок','Отдел продаж','Планово-экономический','Бухгалтерия','Юридический','Логистический'];
            options_otdel.forEach(optionValue => {
              const option = document.createElement('option');
              option.value = optionValue;
              option.text = optionValue;
                // Устанавливаем начальное значение
              if (optionValue === '') {
                option.selected = true;
              }
              select_otdel.appendChild(option);
            });    
            otdelCell.appendChild(select_otdel)
            // ------------------------------------------------------
      // -----------Образование-------------------------------------------
      const select_learn = document.createElement('select');
      const options_learn = ['','Среднее спец.','Высшее','Среднее'];
      options_learn.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.text = optionValue;
          // Устанавливаем начальное значение
        if (optionValue === '') {
          option.selected = true;
        }
        select_learn.appendChild(option);
        });    
      learnCell.appendChild(select_learn)

      const input_tel = document.createElement('input');
      input_tel.type = 'text';
      input_tel.placeholder = "+7 (999) 999 99 99";
      input_tel.id = `tel_id${rowCount + 1}`;
      input_tel.value = "";
    
      telCell.appendChild(input_tel);
    
      $(document).ready(function() {
        $(`#tel_id${rowCount + 1}`).mask("+7 (999) 999-99-99");
      });
    

      const input_email = document.createElement('input');
      input_email.type = 'text';
      input_email.placeholder = "param@gmail.com";
      input_email.className = 'email_class';
      input_email.id = `email_id${rowCount+1}`;
      input_email.value = "";
  
      emailCell.appendChild(input_email);
  
      actionsCell.textContent = " ";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("deleteRowCheckbox");
      checkbox.id = `id_check${rowCount}`;
      actionsCell.appendChild(checkbox);

      });
}

//  -----------Удаление строки-------------------------------------------------------------------
okButton.addEventListener('click', () => {
  document.body.classList.remove('modal-open');
  const checkboxes = document.querySelectorAll('.deleteRowCheckbox');

  const selectedRows = [];

  for (let r = 0; r < checkboxes.length; r++) {
    if (checkboxes[r].checked) {
      selectedRows.push(r + 1);
    }
  }

  let s_del = selectedRows.join(', ');

  const client = new Client({
    user: User,
    host: Ip,
    database: Name_DB,
    password: Password_DB,
    port: Port, // порт PostgreSQL
  });

  client.connect()
    .then(() => {
      console.log('Начало удаления строк');
      return client.query(`DELETE FROM cadet WHERE ID in (${s_del})`);
    })
    .then(result1 => {
      myFunction_select();
    })
    .catch(err => console.error('Error executing query', err))
    .finally(() => {
      client.end();
      console.log('Конец удаления строк');
    });

  confirmationModal.style.display = 'none';
});

okButton_2.addEventListener('click', () => {
  document.body.classList.remove('modal-open');
  img_email.style.display = 'none';

  let n = email_id.replace(/\D/g,'');
  const client = new Client({
    user: User,
    host: Ip,
    database: Name_DB,
    password: Password_DB,
    port: Port, // порт PostgreSQL
  });

  client.connect()
    .then(() => {
      console.log('Начало удаления строк');
      return client.query(`DELETE FROM cadet WHERE ID = ${n}`);
    })
    .then(result1 => {
      myFunction_select();
    })
    .catch(err => console.error('Error executing query', err))
    .finally(() => {
      client.end();
      console.log('Конец удаления строк');
    });

  confirmationModal.style.display = 'none';
});



document.querySelector('.test_rem').addEventListener('click', () => {
  document.body.classList.add('modal-open');
  cancelButton_2.style.display = 'none';
  okButton_2.style.display = 'none';
  img_mess.style.display = '';

  const checkbox_21 = document.querySelectorAll('.deleteRowCheckbox');
  const selectrow_21 = [];

  for (let r = 0; r < checkbox_21.length; r++) {
    if (checkbox_21[r].checked) {
      selectrow_21.push(r + 1);
    }
  }

  let sosiska_21 = selectrow_21.join(', ');

  if (sosiska_21 === "") {
    confirmationText.textContent = 'Вы ничего не выбрали!';
    nothingSelectedModal.style.display = 'block';
  
    okButton.style.display = 'none';
    cancelButton.style.display = 'none';
    img_email.style.display = 'none';

  } else {
    confirmationText.textContent = 'Вы действительно хотите удалить выбранные строки из таблицы?';
    confirmationModal.style.display = 'block';
    cancelButton.style.display = '';
    okButton.style.display = '';
    img_email.style.display = 'none';

  }
});

      // table.addEventListener("input", updateTableArray);
      table.addEventListener("click", updateTableArray);
// ----------------Сортировка---------------------------------------------
{
  $(document).ready(function() {
    // добавляем обработчик клика на каждый заголовок столбца
    $('th').click(function() {
      var table = $(this).parents('table').eq(0)
      var rows = table.find('tr:gt(0)').toArray().sort(compare($(this).index()))
      
      $('th span').remove();
      
      if ($(this).hasClass('asc')) {
        $(this).removeClass('asc');
        $(this).addClass('desc');
        $(this).append('<span>&#9660;</span>');
        rows = rows.reverse();
      } else {
        $(this).removeClass('desc');
        $(this).addClass('asc');
        $(this).append('<span>&#9650;</span>');
      }
      
      for (var i = 0; i < rows.length; i++) {
        table.append(rows[i])
      }
    })
  })
  
  function compare(index) {
    return function(a, b) {
      var valA = getCellValue(a, index), valB = getCellValue(b, index)
      return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB)
    }
  }
  
  function getCellValue(row, index) {
    var cellValue = $(row).children('td').eq(index).text();
  
    // Check if the cell contains a dropdown/select element
    var selectElement = $(row).children('td').eq(index).find('select');
    
    if (selectElement.length > 0) {
      cellValue = selectElement.val();
    }
    if (index === 3) {
      var dateInput = $(row).children('td').eq(index).find('input[type="date"]');
      if (dateInput.length > 0) {
        cellValue = dateInput.val();
      }
    }
    if (index === 4 || index === 5 || index === 9) {
      var dateInput = $(row).children('td').eq(index).find('input[type="number"]');
      if (dateInput.length > 0) {
        cellValue = dateInput.val();
      }
    }
    if (index === 6 || index === 7) {
      var dateInput = $(row).children('td').eq(index).find('input[type="text"]');
      if (dateInput.length > 0) {
        cellValue = dateInput.val();
      }
    }
    return cellValue;
  }

  
  
}

// ----Поле ввода-------------------------------------------------------------
{
  function myFunction() {
    const inputs = [
      document.getElementById("myInput_0"),
      document.getElementById("myInput_1"),
      document.getElementById("myInput_2"),
      document.getElementById("myInput_3"),
      document.getElementById("myInput_4"),
      document.getElementById("myInput_5"),
      document.getElementById("myInput_6"),
      document.getElementById("myInput_7"),
      document.getElementById("myInput_8"),
      document.getElementById("myInput_9")
    ];
  
    const filters = [
      document.getElementById("filterSelect"),
      document.getElementById("filterSelect_1"),
      document.getElementById("filterSelect_2"),
      document.getElementById("filterSelect_3"),
      document.getElementById("filterSelect_4"),
      document.getElementById("filterSelect_5"),
      document.getElementById("filterSelect_6"),
      document.getElementById("filterSelect_7"),
      document.getElementById("filterSelect_8"),
      document.getElementById("filterSelect_9")
    ];
  
    const table = document.getElementById("myTable");
    const rows = table.getElementsByTagName("tr");
  
    function formatDate(dateString) {
      const [year, month, day] = dateString.split("-");
      // return `${day}.${month}.${year}`;
      return `${year}`;

    }
  
    for (let i = 1; i < rows.length; i++) {
      let match = true;
      for (let j = 0; j < inputs.length; j++) {
        const input = inputs[j];
        const filter = filters[j];
        const selectedColumn = parseInt(filter.value);
        const td = rows[i].getElementsByTagName("td")[selectedColumn];
  
        if (selectedColumn === 0 || selectedColumn === 4) {
          if (!td.innerHTML.toLowerCase().startsWith(input.value.toLowerCase())) {
            match = false;
            break;
          }
        } else if (selectedColumn === 1 || selectedColumn === 2 || selectedColumn === 8) {
          const select = td.querySelector("select");
          if (select && !select.value.toLowerCase().startsWith(input.value.toLowerCase())) {
            match = false;
            break;
          }
        } else if (selectedColumn === 3) {
          const inputDate = td.querySelector("input[type='date']");
          if (inputDate && !formatDate(inputDate.value).toLowerCase().startsWith(input.value.toLowerCase())) {
            match = false;
            break;
          }
        }
        else if (selectedColumn === 5 || selectedColumn === 9) {
          const inputDate = td.querySelector("input[type='number']");
          input.value = input.value.replace(/,/g, '.').toLowerCase();
          if (inputDate && !inputDate.value.toLowerCase().startsWith(input.value.toLowerCase())) {
            match = false;
            break;
          }
        }
        else if (selectedColumn === 6) {
          const inputDate = td.querySelector("input[type='text']");
          const str_s = `${inputDate.value.replace(/\D/g, "")}`;
          if (str_s && !str_s.toLowerCase().startsWith(input.value.toLowerCase())) {
            match = false;
            break;
          }
        }
        else if (selectedColumn === 7) {
          const inputDate = td.querySelector("input[type='text']");
          if (inputDate && !inputDate.value.toLowerCase().startsWith(input.value.toLowerCase())) {
            match = false;
            break;
          }
        }
        
      }
  
      if (match) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  }
  
  
  
}

// ----------Запись в exel---------------------------------------------------------------------------------
{
  document.getElementById('writRowBtn').addEventListener("click",()=>{
    const tableElement = document.querySelector('table')
    
    const tableData = [];
    const rows = tableElement.rows;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.style.display === "none") {
        continue;
      }
      const rowData = [];
      const cells = row.cells;
      for (let j = 0; j < cells.length - 1; j++) {
        var cell = row.cells[j];
      if (cell.firstChild && cell.firstChild.nodeName === 'SELECT') {
        const select = cell.firstChild;
        const selectedValue = select.value;
        rowData.push(selectedValue);
      } 
      else if (cell.firstChild && cell.firstChild.nodeName === 'INPUT' && cell.firstChild.type === 'date') {
        const dateInput = cell.firstChild;
        const dateValue = dateInput.value;
        let str_date = dateValue.split('-');
        rowData.push(`${str_date[2]}-${str_date[1]}-${str_date[0]}`);
      }
      else if (cell.firstChild && cell.firstChild.nodeName === 'INPUT' && cell.firstChild.type === 'number') {
        const select = cell.firstChild;
        const selectedValue = select.value;
        rowData.push(selectedValue);
      }
      else if (cell.firstChild && cell.firstChild.nodeName === 'INPUT' && cell.firstChild.type === 'text') {
        const select = cell.firstChild;
        const selectedValue = select.value;
        rowData.push(selectedValue);
      }
      else {
        rowData.push(cell.innerText);
      }
      }
      tableData.push(rowData);
    }
    
    ipcRenderer.send("save-xlsx-file",tableData);
    
    }) 
}

// new_code
{
  let test_add_but = document.querySelector(".test_add");
  test_add_but.addEventListener("click", () => {

    const notifier = require('node-notifier');

    try {
      let arraySearch = document.querySelector(".hidden")
      arraySearch.classList.remove("hidden")
      
      const notifier = require('node-notifier');
    } catch (error) {
      notifier.notify({
        title: 'Info',
        message: 'Добавлено максимальное количество критериев поиска'
      });
    }

  }, false);
  
  function remove_item(i) {
    let search = document.querySelectorAll(".search");
    search[i].classList.add("hidden");
    document.getElementById(`myInput_${i}`).value = "";
    myFunction();
  }

  

}

// --------------Выпадающее меню--------------------
{
  const filterSelects = document.querySelectorAll('select');
  const filterValues = [];

  filterSelects.forEach(select => {
    select.addEventListener('change', () => {
      // Скрываем выбранные значения в других select-ах
      filterSelects.forEach(s => {
        const val = s.value;
        if (val !== '') {
          const otherSelects = Array.from(filterSelects).filter(other => other !== s);
          otherSelects.forEach(other => {
            const option = other.querySelector(`option[value="${val}"]`);
            if (option) option.hidden = true;
          });
        }
      });

      // Заполняем массив выбранных значений
      filterValues.length = 0;
      filterSelects.forEach(select => {
        const val = select.value;
        if (val !== '') {
          filterValues.push(val);
        }
      });

      // Заполняем выборки option-ами, которые еще не выбраны
      filterSelects.forEach(s => {
        const options = s.querySelectorAll('option');
        options.forEach(option => {
          if (option.value === '') return;
          if (filterValues.includes(option.value)) {
            option.hidden = true;
          } else {
            option.hidden = false;
          }
        });
      });
    });
  });

// -------------Удаление элементов из массива----------------------
for (let i = 0; i < filterSelects.length; i++) {
  const button = document.getElementById(`s${i}`);

  const select = filterSelects[i];

  button.addEventListener('click', () => {
    const selectedValue = select.value;
    const index = filterValues.indexOf(selectedValue);

    if (index > -1) {
      filterValues.splice(index, 1);
      select.value = 10;
    }

    // Заполняем массив выбранных значений
    filterValues.length = 0;
    filterSelects.forEach((select) => {
      const val = select.value;
      if (val !== '') {
        filterValues.push(val);
      }
    });

    // Заполняем выборки option-ами, которые еще не выбраны
    filterSelects.forEach((s) => {
      const options = s.querySelectorAll('option');
      options.forEach((option) => {
        if (option.value === '') return;
        if (filterValues.includes(option.value)) {
          option.hidden = true;
        } else {
          option.hidden = false;
        }
      });
    });
  });
}
}

