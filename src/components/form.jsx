import { useState } from 'react'
import FormVotar from '../components/form-votar'
import css from './form.css'
const FormularioExibicao = ({ data, id, votos }) => {
  const [showFormVotar, setShowFormVotar] = useState(false)
  const [atualData, setAtualData] = useState()

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('pt-BR', options)
  }

  const handleFormClick = () => {
    setShowFormVotar(true)
    setAtualData(data)
  }

  const handleCloseFormVotar = () => {
    setShowFormVotar(false)
  }

  return (
    <div>
      <div
        className="container-form"
        onClick={handleFormClick}
      >
        <h2 className="title-enquete">Detalhes da Enquete</h2>
        <div className="mb-4 padding">
          <p className="font-semibold marginp">Título:</p>
          <p>{data.titulo}</p>
        </div>
        <div className="mb-4 padding">
          <p className="font-semibold marginp">Data de Início:</p>
          <p>{formatDate(data.data_inicio)}</p>
        </div>
        <div className="mb-4 padding">
          <p className="font-semibold marginp">Data de Término:</p>
          <p>{formatDate(data.data_termino)}</p>
        </div>
        <div className="mb-4 padding">
          <p className="font-semibold marginp ">Opções:</p>
          {data.opcoes.map((opcao, index) => (
            <div key={index} className="mb-2">
              <p>
                {opcao.opcao} - Votos:{' '}
                {votos
                  .filter((voto) => opcao.id === voto.opcao_id)
                  .map((voto) => voto.qntd_votos)}{' '}
              </p>
            </div>
          ))}
        </div>
      </div>

      {showFormVotar && (
        <div className="flex-votar">
          <div className="votar-container">
            <FormVotar data={atualData} onClose={handleCloseFormVotar} id={id}/>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormularioExibicao
