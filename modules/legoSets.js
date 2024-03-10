const setData = require("../data/setData");
const themeData = require("../data/themeData");

module.exports = {initialize, getAllSets, getSetsByNum, getSetsByTheme};

let sets = [];

function initialize(){

    return new Promise((resolve, reject) => {
        try {
            setData.forEach(element => {
                let themeID = element.theme_id;
                let themeName;
        
                themeData.forEach(element2 => {
                    if(themeID == element2.id){
                        themeName = element2.name;
                    }
                });
        
                element.theme = themeName;
                 sets.push(element)
            });

            resolve();
        } catch (error) {
            reject(error);
        }
    });

   
}

function getAllSets(){
    return new Promise((resolve, reject) => {
         if (sets.length > 0) {
            resolve(sets);
        } else {
            // If not populated, call initialize and resolve the promise after it's done
            initialize()
                .then(() => resolve(sets))
                .catch(error => reject(error));
        }
        
    })

}

function getSetsByNum(setNum){
    return  new Promise((resolve, reject) => {

        const foundSet = sets.find(element => element.set_num === setNum);
        if (foundSet){
            resolve(foundSet);
        } else {
            reject("Unable to find requested set");
        }       
    })
}

function getSetsByTheme(theme){

    return new Promise((resolve, reject) => {
        const decodedTheme = decodeURIComponent(theme);
        const lowerCaseTheme = decodedTheme.toLowerCase();
        const foundSets = sets.filter(set => set.theme.toLowerCase().indexOf(lowerCaseTheme) !== -1);

        if (foundSets.length > 0) {
            resolve(foundSets);
        } else {
            reject("Unable to find requested sets");
        }
    });

}