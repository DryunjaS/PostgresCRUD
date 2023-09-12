// const { Client } = require('pg');

// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'node_db',
//   password: '9153',
//   port: 5432, // порт PostgreSQL
// });

// client.connect();

// client.query('SELECT * FROM cadet', (err, res) => {
//   // console.log(err ? err.stack : res.rows);
//   if(err){
//     console.log(err)
//   }
//   else{
//   let data = res.rows;
//   for(let i=0;i<res.rowCount;i++){
//      // Create a new row
//    const newRow = table.insertRow();
 
//    // Add two cells to the new row
//    const nameCell = newRow.insertCell();
//    const rangCell = newRow.insertCell();
//    const groupCell = newRow.insertCell();
//    const dateCell = newRow.insertCell();
//    const selaryCell = newRow.insertCell();

//    const actionsCell = newRow.insertCell();
 
//    // Add contenteditable attribute to name and age cells
//    nameCell.contentEditable = true;
//    rangCell.contentEditable = true;
//    groupCell.contentEditable = true;
//    dateCell.contentEditable = true;
//    selaryCell.contentEditable = true;
 
//    nameCell.textContent = data.at(i).fio;
//    rangCell.textContent = data.at(i).rang;
//    groupCell.textContent = data.at(i).n_group;
//    let text_date = `${data.at(i).date_b}`.split('00:00:00 GMT+0300 (Москва, стандартное время)').join('');
//   //  dateCell.textContent = data.at(i).date_b;
//   dateCell.textContent = text_date;
//    selaryCell.textContent = data.at(i).salary;

//    // Add text to the actions cell and create a Delete button
//    actionsCell.textContent = " ";
//    const deleteBtn = document.createElement("button");
//    deleteBtn.textContent = "Delete";
//    deleteBtn.classList.add("deleteRowBtn");
//    actionsCell.appendChild(deleteBtn);
//   }
//   client.end();
//   }
// });
