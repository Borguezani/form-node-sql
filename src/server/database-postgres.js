const {sql} = require ('./db.js')
class DataBasePostgres{

async list(search) {
   let forms

   if (search) {
      forms = await sql`select * from enquetes where id = ${search}`
   }else{
      forms = await sql`SELECT
      enquetes.id,
      enquetes.titulo,
      enquetes.data_inicio,
      enquetes.data_termino,
      JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', opcoes.id,
              'opcao', opcoes.opcao
          )
      ) AS opcoes
  FROM
      enquetes
  JOIN
      opcoes ON enquetes.id = opcoes.enquete_id
  GROUP BY
      enquetes.id, enquetes.titulo, enquetes.data_inicio, enquetes.data_termino;`
   }
   return forms
}
async create(form) {
   const { title, field1, field2, field3, data_inicio, data_termino, opcao_id, data_voto } = form;

   if (title !== undefined && field1 !== undefined && field2 !== undefined && field3 !== undefined && data_inicio !== undefined && data_termino !== undefined) {
       // Criação de uma nova enquete com opções
       const enqueteResult = await sql`insert into enquetes (titulo, data_inicio, data_termino) values (${title},${data_inicio},${data_termino}) RETURNING id`;
       const enqueteId = enqueteResult[0].id;

       await Promise.all([
           sql`insert into opcoes (enquete_id, opcao) values (${enqueteId}, ${field1})`,
           sql`insert into opcoes (enquete_id, opcao) values (${enqueteId}, ${field2})`,
           sql`insert into opcoes (enquete_id, opcao) values (${enqueteId}, ${field3})`
       ]);
   } else if (opcao_id !== undefined && data_voto !== undefined) {
       // Registro de um voto
       await sql`insert into votos (opcao_id, data_voto) values (${opcao_id}, ${data_voto})`;
   } else {
       // Lógica para lidar com casos inválidos
       console.error('Dados insuficientes para criar uma nova enquete ou registrar um voto.');
   }
}

async update(id, form) {
   const {title, field1, field2, field3, data_inicio, data_termino} = form
   await sql`update enquetes set titulo = ${title}, data_inicio = ${data_inicio}, data_termino = ${data_termino} where id = ${id} `
   const opcoesResult = await sql`select id from opcoes where enquete_id = ${id}`
   const opcoesIds = opcoesResult.map(opcao => opcao.id)
   await Promise.all([
      sql`update opcoes set opcao = ${field1} where enquete_id = ${id} and id = ${opcoesIds[0]}`,
      sql`update opcoes set opcao = ${field2} where enquete_id = ${id} and id = ${opcoesIds[1]}`,
      sql`update opcoes set opcao = ${field3} where enquete_id = ${id} and id = ${opcoesIds[2]}`
     ])
}
async delete(id) {
   await sql`delete from enquetes where id = ${id}`
   const opcoesResult = await sql`select id from opcoes where enquete_id = ${id}`
   const opcoesIds = opcoesResult.map(opcao => opcao.id)
   if (opcoesIds.length > 0){
   await Promise.all([
      sql`delete from opcoes where enquete_id = ${id} and id = ${opcoesIds[0]}`,
      sql`delete from opcoes where enquete_id = ${id} and id = ${opcoesIds[1]}`,
      sql`delete from opcoes where enquete_id = ${id} and id = ${opcoesIds[2]}`
     ])}
}

}

module.exports = { DataBasePostgres }