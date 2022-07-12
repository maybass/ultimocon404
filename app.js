const express = require('express');
const hbs = require('hbs');
const path = require('path');
const nodemailer = require("nodemailer");
const productos = require('./productos.json');// luego hacerlo con base de datos
const app = express();



app.set('view engine', 'hbs');
//para q m tome archivos q esten dentro de views pero dentro de otras carpetas BACK Y FRONT
//PARA PODER SEGUIR MANEJANDOLOS COMO 'INDEX', 'PRODUCTOS' sin la necesidad de establecer ruta especifica y detallada, lo busca solo 
//requiero path para poder hacerlo, codigo abajo
app.set('views', [
	path.join('./views/front'),
	path.join('./views/back'),
	path.join('./views')//NECESARIO MUY NECESARIO PARA Q ENCUENTRE EL 404 Q ESTA FUERA DE BACK Y FRONT
]) 


//archivos estaticos en carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')))

//codigo necesario para leer req.body 
// req.params para url, ver mas tarde
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));



app.use(express.static('public'))

//registrar parciales {{ > }}  para poder usar los parciales
hbs.registerPartials(__dirname + '/views/partials')



// ======= RUTAS FRONT ====================

app.get('/', (req,res)=> {
	res.render('index' , {
		titulo: 'Inicio'
	});
	
})

app.get('/log-in' , (req,res)=> { //falta hacer el metodo post para el login
	res.render('log-in' , {
		titulo: 'Log In'
	});
	
	
})

app.get('/detalles-producto' , (req,res)=> {
	res.render('detalles-producto' , {
		titulo: 'Detalles del producto ',
		productos: productos
	});
	
})




app.get('/sobre-nosotros', (req,res)=> {
	res.render('sobre-nosotros' , {
		titulo: 'Sobre Nosotros'
	});
	
	
})


app.get('/como-comprar', (req,res)=> {
	res.render('como-comprar' , {
		titulo: 'Como Comprar'
	});
	
	
})

app.get('/productos', (req,res)=> {
	res.render('productos' , {
			titulo: 'Productos', 
			productos: productos
			
		})
	});
	
	


app.get('/contacto', (req,res)=> {
	res.render('contacto' , {
		titulo: 'Contacto'
	});
	
	
})

app.post('/contacto' , (req,res)=> {
var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: ,//process.env.EMAIL_USER, 
    pass: //process.env.EMAIL_PASS 
  }
});





//usar dotenv para referenciar variables para q no esten a la vista de todos , q esas variables solo se definan en nuestra pc 
//datos sensibles 
//git ignore junto con nodemodules. node modules lo vuelvo a instalar con npm i
// .env nunca se sube a github al igual q node_modules
	
	//2.definimos el cuerpo de mail CUERPO
	console.log("BODY: " , req.body)
	let data = req.body //info recibida del formulario
	let mailOptions = {
		from: data.email, 
		to: 'probando@prueba' ,//mail al q quiero q envie esta info, que pongo usando mailtrap.io? Funciona poniendo cualquier mail
		subject : data.asunto,
		text : data.comentarios
	}
	
	//3. enviamos el mail  MAIL
	transport.sendMail(mailOptions, (err, info) => {
		if(err) {
			console.log(err)
			res.status(500, err.message)
			res.status(500).render('/contacto' , {
				mensaje: `ha ocurrido el siguiente error ${err.message}`
				
			})
		}else {
			console.log('email enviado')
			res.status(200).render('contacto' , {
				mensaje : `tu email ha sido enviado correctamente`
			})
		}
		
	})
})

/*app.get('/terms' , (req,res)=> {
	res.render('terms' , {
		titulo: 'Terminos y Condiciones'
	}); //deberia ser un estatico, ya esta en public 
	
	
	
})*/



// =============== RUTAS BACK =====================
//ADMIN y crud AGREGAR Y EDITAR Y LOGin

app.get('/admin', (req,res) => {
	res.render('admin' , {
		titulo : 'Admin'
	})
	
})

app.get('/agregar-producto', (req,res) => { //falta hacerle la ruta post
	res.render('agregar-producto' , {
		titulo : 'Agregar Producto'
	})
	
})

app.get('/editar-producto', (req,res) => {
	res.render('editar-producto' , {
		titulo : 'Editar Producto' // falta hacerle la ruta post correspondiente, leyendo base de datos con UPDATE
	})
	
})

app.get('/log-in' , (req,res)=> { //falta hacer el metodo post para el login
	res.render('log-in' , {
		titulo: 'Log In'
	});
	
	
})


// 404 es un middleware que VA DESPUES DE TODAS LAS RUTAS , VA AL FINAL PORQ PRIMERO LEE TODAS Y EN CASO D NO ENCONTRARLAS TIRA EL 404
// SI VE Q NO EXISTE NINGUNA RUTA AL LEER EL CODIGO, AHI SI EJECUTA EL 404 NOT FOUND
// SI VE Q NO EXISTE NINGUNA RUTA AL LEER EL CODIGO, AHI SI EJECUTA EL 404 NOT FOUND, es un middleware

app.use((req,res, next)=> { // con o sin next
	res.status(404).render('404' , {
		titulo: '404 -Not Found'
	});
})

// servidor escuchando en puerto 3000

app.listen(3000, () => {
	console.log('Servidor en puerto 3000');
	
})

