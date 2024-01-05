const {Pool} = require('pg');

const pool = new Pool({
    user: 'zararestock_user',
    host: 'frankfurt-postgres.render.com',
    database: 'zararestock',
    password: 'jh8tkBdPd82dqetoRMGhHVmMK8wVeyNQ',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
      }
});

dangerous_query = async (text, params) => {
    return await pool.query(text, params)
        .then(res => {
            return res;
        });
}

async function query(text, params, throwerr=false){
    try {
        console.log(text)
        const result = await dangerous_query(text, params);
        return result.rows;
    } catch (err) {
        console.error("Error while querying the database:")
        console.log(err);
        if (throwerr)
            throw err
    }
}

module.exports = {
    query: query,
    dangerous_query: dangerous_query,
    pool: pool
}
