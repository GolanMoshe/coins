
const labels ={
    he:{
        userForm:{
            submitBtn:{
                saveUser: 'שמור',
                addUser: 'הוסף' ,
                editUser:'ערוך'           
            }
        }
    },

    en:{
        userForm:{
            submitBtn:{
                saveUser: 'Save',
                addUser: 'Add',
                editUser:'Edit'          
            }
        }
    }
}



function LangService() {

    let lang = getSelectLang();

    function getLabel(lablKey){
        //TODO: find a better way without using eval
        return eval(`labels.${lang}.${lablKey}`);
    } ;

    function getSelectLang(){
        return (storageService.getItem( Config.SELECTED_LANG)) ?? Config.DEFAULT_LANG
    }

    function setLanguage(selectedLang){
        storageService.setItem(Config.SELECTED_LANG, JSON.stringify(selectedLang));
    };
    
    return {
        getLabel,
        setLanguage,
        getSelectLang
    };

}




