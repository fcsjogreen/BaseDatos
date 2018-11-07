const express = require('express')
const Router = express.Router()
const User = require('./usuarios.js');
const Event = require('./eventos.js');
const path = require('path');
const bodyParser = require('body-parser');


Router.use(bodyParser.json());
Router.use(bodyParser.urlencoded({ extended: true}));

var currentUser ="";
var eventos =[];
var numEventos =0;

Router.get('/', function(req,res){
    res.sendFile(path.join(__dirname, '/client', 'index.html'));
});

Router.get('/main', function(req,res){
    res.sendFile(path.join(__dirname, '/client', 'main.html'));
});

Router.post('/register', function(req,res){
    let usuario = req.body.usuario;
    let contrasena = req.body.contrasena

    let nuevoUsuario= User();
    nuevoUsuario.usuario = usuario;
    nuevoUsuario.contrasena = contrasena;
    nuevoUsuario.eventos=[];

    nuevoUsuario.save(error=>{
        if(error){
            console.log(error);
            return res.status(500).send();
        }else{
            return res.status(200).send();
        }
        
    })

});

Router.post('/login', function(req,res){
    let usuario = req.body.user;
    let cont = req.body.pass;  
    /*
    let nuevoUsuario= User();
    nuevoUsuario.usuario = usuario;
    nuevoUsuario.contrasena = cont;
    nuevoUsuario.eventos=[];

    nuevoUsuario.save(error=>{
        if(error){
            console.log(error);
            return res.status(500).send();
        }else{
            return res.status(200).send();
        }
        
    })
    */
   //console.log("usuario "+usuario+" contraseña "+cont);
    User.findOne({usuario: usuario, contrasena: cont}).then(user=>{
        //console.log("user "+user)
        if(!user){
            //console.log("usuario no existe");
            return res.status(404).send();
        }else{
            eventos.push(usuario.eventos) 
            currentUser= user;       
            return res.send("Validado");
            
        }         
    }).catch(err => {
        console.log(err)
        return res.status(500).send()
    });         
        
              
    
})

//Datons iniciales 
/*
Router.get('/events/all', function(req,res){
    let numEventos =eventos.length;
    let eventosEnviar =[];
    if(numEventos>0){
        for(let i = 0; i< numEventos; i++){
            Event.findOne({id: eventos[i].id}).exec((err, event)=>{
                if (err) {
                    res.status(500)
                    res.json(err)
                }else{
                    let currentEvent ={
                        title: event.title,
                        start: event.start,
                        end: event.end
                    };
                    eventosEnviar.push(currentEvent);            
                }            
            })
        }
        res.send(eventosEnviar);
    }
    
})
*/

Router.get('/events/all', function (req, res) {
   
    Event.find({usuario: currentUser }).exec((err, event) => {
        let numEventos =event.length;
        let eventosEnviar =[];
        
        //quitar usuarios
        if (err) {
            return res.status(500).send()

        } else {
            for(let i=0; i<numEventos;i++){
                let currentEvent ={
                    _id: event[i]._id,
                    title: event[i].title,
                    start: event[i].start,
                    end: event[i].end
                }
                
                eventosEnviar.push(currentEvent);  
                console.log("Evento  "+currentEvent.title)
            }
            //console.log("Evento  "+eventosEnviar)
            return res.send(eventosEnviar);

        }
    });
    


})

//Eliminar Evento
Router.post('/events/delete/:title', function(req,res){
    let name = req.params.title;
    //console.log(eid);
    Event.deleteOne({title: name}).exec((err, event)=>{
        if (err) {
            return res.status(500).send();
            
        }else{
            return res.send("Evento eliminado");
        }
        
    })
})

//Guardar Evento
Router.post('/events/new', function(req,res){
    let evento = new Event({
        usuario: currentUser,
        title: req.body.title,
        start: req.body.start,
        end: req.body.end
    });
    //console.log("Evento "+evento);
    evento.save(error=>{
        if(error){
            return res.status(500).send();
        }else{
            return res.send("Evento guardado");
        }
        
    });

    User.findOneAndUpdate({_id: currentUser},{$push: {eventos: evento}},(error,result)=>{
        if(error){
            return res.status(500).send()
        }else{
            console.log("Evento guardado "+result)
        }
        
    })
})

//Actualizar Evento
Router.post('/events/actualizar', function(req,res){
    Event.find({_id: req.body._id, title: req.body.title}).exec((error,result)=>{
        if (error) {
            return res.status(500).send();
            
        }
        result.set({title: req.body.title, start: req.body.start, end: req.body.end});
        result.save((error)=>{
            if(error){
               return res.status(500).send();
                               
            }else{
                console.log("actualizado "+result)
                return res.send("Evento actualizado");
            }
            
            
        })
        
    })
    
   
})

module.exports = Router;