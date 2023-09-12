var fs = require('fs');

// ------Проба------------------------------------
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let initialWindow;
let mainWindow;

function createInitialWindow() {
  initialWindow = new BrowserWindow({
    width: 450,
    height: 470,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // initialWindow.webContents.openDevTools();

  initialWindow.removeMenu()
  initialWindow.loadFile(path.join(__dirname, 'initial.html'));
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // mainWindow.webContents.openDevTools();
  mainWindow.removeMenu();
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

}

app.whenReady().then(() => {
  createInitialWindow();

  ipcMain.on('initialFormSubmit', (event, values) => {
    createMainWindow();
    mainWindow.webContents.once('did-finish-load', () => {
      mainWindow.webContents.send('initialFormValues', values);
    });
    initialWindow.close();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createInitialWindow();
  }
});


// -------------------------------------------------
ipcMain.on('save-xlsx-file', (e,arr_w) => {
  const fs = require('fs');
  const { dialog } = require('electron');
  const xlsx = require('xlsx');
  
  
  const workbook = xlsx.utils.book_new();
  const sheetName = 'Сотрудники';
  const worksheet = xlsx.utils.json_to_sheet([]);
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
// --------------Шапка--------------------------------------------------------------

  xlsx.utils.sheet_add_aoa(worksheet, [['               УТВЕРЖДАЮ']], {origin: 'I1'});

  xlsx.utils.sheet_add_aoa(worksheet, [['Начальник    отдела    кадров']], {origin: 'I2'});
  
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const currentDate = new Date();
  const monthIndex = currentDate.getMonth();
  const month = months[monthIndex];
  const ageIndex = currentDate.getFullYear();

  xlsx.utils.sheet_add_aoa(worksheet, [[`__ ${month} ${ageIndex}          О.Н. Сидоров`]], {origin: 'I3'});

  xlsx.utils.sheet_add_aoa(worksheet, [['Таблица сотрудников магазина']], {origin: 'A4'});


// ------------Таблица------------------------------------------------------------------------
for(let i=0;i<arr_w.length;i++){
  for(let j=0;j<10;j++){
    if(!arr_w[i][j] || arr_w[i][j] == 'undefined-undefined-' || arr_w[i][j] == 'Некорректное значение'){
      arr_w[i][j] = " ";
    }
  }
  xlsx.utils.sheet_add_aoa(worksheet, [[arr_w[i][0]]], {origin: `A${i+6}`});
  xlsx.utils.sheet_add_aoa(worksheet, [[arr_w[i][1]]], {origin: `B${i+6}`});
  xlsx.utils.sheet_add_aoa(worksheet, [[arr_w[i][2]]], {origin: `C${i+6}`});
  xlsx.utils.sheet_add_aoa(worksheet, [[arr_w[i][3]]], {origin: `D${i+6}`});
  xlsx.utils.sheet_add_aoa(worksheet, [[arr_w[i][4]]], {origin: `E${i+6}`});
  xlsx.utils.sheet_add_aoa(worksheet, [[arr_w[i][5]]], {origin: `F${i+6}`});
  xlsx.utils.sheet_add_aoa(worksheet, [[arr_w[i][6]]], {origin: `G${i+6}`});
  xlsx.utils.sheet_add_aoa(worksheet, [[arr_w[i][7]]], {origin: `H${i+6}`});
  xlsx.utils.sheet_add_aoa(worksheet, [[arr_w[i][8]]], {origin: `I${i+6}`});
  xlsx.utils.sheet_add_aoa(worksheet, [[arr_w[i][9]]], {origin: `J${i+6}`});
}


// -------Пол----------------------------------------------------------------------------------
xlsx.utils.sheet_add_aoa(worksheet, [['Директор магазина']], {origin: `A${arr_w.length+7}`});

// Получаем число и месяц из текущей даты
const day = currentDate.getDate();
let day_s=`${day}`;
if(day<10){
  day_s=`0${day}`;
}

xlsx.utils.sheet_add_aoa(worksheet, [[`${day_s} ${month} ${ageIndex}г.`]], {origin:  `A${arr_w.length+8}`});
xlsx.utils.sheet_add_aoa(worksheet, [['Н.А. Петров']], {origin: `J${arr_w.length+7}`});

const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  // ---------------------Диалоговое окно-----------------------------
  dialog.showSaveDialog({
    title: 'Save File',
    defaultPath: '/path/to/file',
    filters: [
      { name: 'Excel Files', extensions: ['xlsx'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  }).then(result => {
    if (!result.canceled) {
      fs.writeFileSync(result.filePath, buffer);
    } 
  })

  .catch(err => {
    console.log(err);
  });

});
