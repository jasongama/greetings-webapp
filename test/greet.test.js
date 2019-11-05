
const assert = require('assert');
const GreetFactory = require("../greetLogic");
const pg = require("pg");
const Pool = pg.Pool;

// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost/greetings';

const pool = new Pool({
    connectionString
});

describe('The basic database web app', function(){

    beforeEach(async function(){
        // clean the tables before each test run
        await pool.query("delete from greetings;");
        
    });

    it('It should count names  ', async function(){
        
        // the Factory Function is called CategoryService
        let greeting = GreetFactory(pool);
        await greeting.greetInput('English',"jason");
        await greeting.greetInput('IsiXhosa','Odwa');
        await greeting.greetInput('IsiZulu',"jesse");
        await greeting.greetInput('English','siwe');
       
     
        
        assert.equal(4,await greeting.getTotalCount());

    });
    it('It should not accept duplicate', async function(){
        
        // the Factory Function is called CategoryService
        let greeting = GreetFactory(pool);
        await greeting.greetInput('English',"jason");
        await greeting.greetInput('IsiXhosa','jasoN');
        await greeting.greetInput('IsiZulu',"jason");
        await greeting.greetInput('English','JASON');
       
     
        
        assert.equal(1,await greeting.getTotalCount());

    });
    it('It should be able to count sum of the individual users', async function(){
        
        // the Factory Function is called CategoryService
        let greeting = GreetFactory(pool);
        await greeting.greetInput('English',"jason");
        await greeting.greetInput('English',"jason");
        await greeting.greetInput('English',"jason");
        await greeting.counter("jason")
     
        
        assert.equal(1,await greeting.getTotalCount());

    });
    it('It should not count the when the string is empty', async function(){
        
        // the Factory Function is called CategoryService
        let greeting = GreetFactory(pool);
        await greeting.greetInput('');
        
     
        
        assert.equal(0,await greeting.counter());

    });

    it('It should allow user to select an language of thier choice', async function(){
    let greeting = GreetFactory(pool);

    await greeting.greetInput('English', 'Jason');
    assert.equal("Hello, Jason", await greeting.greetedinput());

    await greeting.greetInput('IsiZulu', 'Justin');
    assert.equal("Sawubona, Justin", await greeting.greetedinput());

    await greeting.greetInput('IsiXhosa', 'Tarantino');
    assert.equal("Molo, Tarantino", await greeting.greetedinput());

    });
    it('should be able to delete the names that are being greeted from the database', async function(){
   
        await pool.query('DELETE FROM greetings')
      });

    after(function(){ 
        pool.end();
    })
    
});