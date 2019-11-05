 module.exports= function GreetFactory(pool) {

     var store =  {};
     var theGreeting = "";
     var count = 0;   
      
   async  function greetInput(language, name) {          
         if(name && language){
            var greetingNames = name.toLowerCase()
                if(store[greetingNames] === undefined){
                    store[greetingNames] = 0;
                }
            
            greetingNames =   greetingNames.charAt(0).toUpperCase() +   greetingNames.slice(1);
           
            var database = await pool.query('Select * from greetings WHERE namesgreeted = $1', [greetingNames]);
         if(database.rowCount === 1){
             await pool.query('UPDATE greetings SET count = count + 1 WHERE namesgreeted = $1' , [greetingNames]);
         }
         else{
            await pool.query('insert into greetings (namesgreeted , count ) values($1 , $2)',[greetingNames, 1] );
         }

         if (language === "English") {
             theGreeting = "Hello, " +  greetingNames
         }
         else if (language === "IsiZulu") {
             theGreeting = "Sawubona, " +  greetingNames
         }
         else if (language === "IsiXhosa") {
             theGreeting = "Molo, " +  greetingNames
         }
         }
        
     }


     async function greetedinput(){
    return await theGreeting
     }

    async function getGreet() {
        let storeDatabase = await pool.query('Select distinct namesgreeted, count from greetings')
         return storeDatabase.rows
     }

     async function getTotalCount(){
        var nameDB = await pool.query('select * from greetings')
        return nameDB.rowCount
     }

   async  function counter(name) {
        var nameDB = await pool.query('select count from greetings where namesgreeted = $1',[name])
        if(nameDB.rows.length > 0){
        return nameDB.rows[0].count
        }else{
            return false;
        }
        
     }

   
     function message(){
        return theGreeting
     }  
     async function resetbtn(){
        await pool.query('DELETE FROM greetings')
        theGreeting = ""
     }


     return {
         counter,
         getGreet,
         greetInput,
         getTotalCount,
         greetedinput,
         message,
         resetbtn,
         
        
     }
 }