
import db from '../models/index';
let getHomnePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch(e){
        console.log(e);
    }
}


module.exports = {
    getHomnePage: getHomnePage,
}