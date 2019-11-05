 module.exports=function greetRouter(greeting){
    async function index(req,res){
        
        res.render("index", {   
            namesGreet: await greeting.greetedinput(),
            counting: await greeting.getTotalCount(),
            message: req.flash('error'),
            
        })
    }
        async function reset(){
            
            await greeting.resetbtn()
        }
     
     return {
         index,
         greeting, 
         reset
     }
 }
