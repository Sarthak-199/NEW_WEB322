require('dotenv').config();

const { Sequelize } = require('sequelize');

const setData = require("../data/setData"); 
const themeData = require("../data/themeData");

let sequelize = new Sequelize('neondb', 'neondb_owner', 'LN3kUM6AFTru', {
  host: 'ep-empty-paper-a5jcsq0m.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const Theme = sequelize.define('Theme', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING
},
{
  createdAt: false,
  updatedAt: false,
}
);

// Set 모델 정의
const Set = sequelize.define('Set', {
  set_num: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: Sequelize.STRING,
  year: Sequelize.INTEGER,
  num_parts: Sequelize.INTEGER,
  theme_id: Sequelize.INTEGER,
  img_url: Sequelize.STRING,
  },
{
  // createdAt 및 updatedAt 속성 비활성화
  createdAt: false,
  updatedAt: false,
});

Set.belongsTo(Theme, {foreignKey: 'theme_id'});



function initialize(){
  return new Promise(async (resolve, reject)=> {
  try{
    await sequelize.sync();
    resolve();
  }
  catch(err){
    reject(err.message)
  }
});
}



function getAllSets(){
  return new Promise(async (resolve, reject)=>{
    let sets = await Set.findAll({include: [Theme]})
    resolve(sets);
  });
}

function getAllThemes(){
  return new Promise(async (resolve, reject)=>{
    let themes = await Theme.findAll()
    resolve(themes);
  });
}


function getSetByNum(setNum){
  return new Promise(async (resolve, reject)=>{
let findNum = await Set.findAll({include: [Theme],  where: { set_num: setNum }})
if(findNum.length > 0){
  resolve(findNum[0]);
}
else
{
  reject("Unable to find requested sets");
}
  });
}


function getSetsByTheme(theme){
  return new Promise(async (resolve, reject)=>{
    let foundSets = await Set.findAll({include: [Theme], where: {'$Theme.name$': {[Sequelize.Op.iLike]: `%${theme}%`} 
  }});

  if(foundSets.length > 0){
    resolve(foundSets);
  }
  else
  {
    reject("Unable to find requested sets");
  }
  });
}

function addSet(setData){
  return new Promise(async (resolve, reject)=>{
try{
  await Set.create(setData);
  resolve();
}catch(err){
reject(err.errors[0].message)
}
  });
}

function editSet(set_num, setData) {
  return new Promise(async (resolve, reject) => {
    try{
      await Set.update(setData, {where: {set_num: set_num}})
      resolve();
    }catch(err){
reject(err.errors[0].message);
    }
  });
}

function deleteSet(set_num){
  return new Promise(async (resolve, reject)=>{
    try{
await Set.destroy({where: {set_num : set_num}});
resolve();
    }catch(err){
        reject(err.errors[0].message);
    }

  });
}

module.exports = { initialize, getAllSets, getAllThemes, getSetByNum, getSetsByTheme, addSet, editSet, deleteSet}; 

