const {sql} = require ('./db.js')
class VotosDataBasePostgres{

    async list(){
        const response = await sql`SELECT opcao_id, COUNT(id) AS qntd_votos
        FROM votos
        GROUP BY opcao_id;`
        return response
    }
}

module.exports = { VotosDataBasePostgres }