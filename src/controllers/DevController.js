const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');


module.exports = {
    //listar usuario
    async index(req, res){
        const  devs = await Dev.find();

        return res.json(devs);
    },



    async store (req, res){
        const {github_username, techs, latitude, longitude} = req.body;

        //Verificação se ja existe o dev cadastrado
        let dev = await Dev.findOne({github_username});

        //se não existir, cria o usuario
        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            //name = login(Se o name não existir, ele pega o login do usuario, isso substitui um if)
            const {name = login, avatar_url, bio} = apiResponse.data;
        
            console.log(name, avatar_url, bio, github_username, techs);
        
            //split vai cortar a stream toda vez que tiver uma virgula 
            //map percorre todo o array, para cada uma das informações, pode executar alguma coisa
            //trim(remove espaçamentos antes e depois)
            
            const TechsArray = parseStringAsArray(techs);
        
            const location = {
                //igual a o PointSchema
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            dev =  await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: TechsArray,
                location,
                
            });
        }
    
       
        
        return res.json(dev);
    }
}