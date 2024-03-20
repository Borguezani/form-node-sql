import React, { useState } from 'react'
import dayjs from 'dayjs'
import css from './form-votar.css'
import utc from 'dayjs/plugin/utc'
import FormularioEdicao from './edit-form'
dayjs.extend(utc)
export default function FormVotar({ data, onClose, id }) {
  const [loading, setLoading] = useState(false)
  const [loadingVoto, setLoadingVoto] = useState(false)
  const [dataVoto, setDataVoto] = useState(false)
  const [showFormEdit, setShowFormEdit] = useState(false)
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('pt-BR', options)
  }
  const handleEdit = async () =>{
    setLoading(true)
    setShowFormEdit(true)
  }
  const handleCloseFormEdit = () => {
    setShowFormEdit(false)
    onClose(false)
    setLoading(false)
  }
  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3030/form/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        document.dispatchEvent(new Event('formSubmitted'))
        onClose(true)
      } else {
        console.error('Erro ao deletar a enquete')
      }
    } catch (error) {
      console.error('Erro ao deletar a enquete:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVotos = async (opcao) => {
    const dataAtualVoto = dayjs().utc() // Pegar a data atual em UTC
    const dataTerminoUTC = dayjs(data.data_termino).utc().subtract(6, 'hour').format('YYYY-MM-DDTHH:mm')
    if (dataAtualVoto.isAfter(dataTerminoUTC)) {
      setDataVoto(true)
      alert('A enquete já terminou. Não é possível votar mais.')
      onClose(false)
      return
    }
    setLoadingVoto(true)
    const dataAtual = dayjs()
    const formattedDate = dataAtual.format('YYYY-MM-DD HH:mm:ss')

    const formData = {
      data_voto: formattedDate,
      opcao_id: opcao.id,
    }

    try {
      const response = await fetch('http://localhost:3030/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        document.dispatchEvent(new Event('formSubmitted'))
        onClose(true)
      } else {
        throw new Error('Falha ao registrar o voto.')
      }

      console.log('Voto registrado com sucesso.')
    } catch (error) {
      console.error('Erro ao registrar o voto:', error)
    } finally {
      setLoadingVoto(false)
    }
  }

  return (
    <div className="votar-container">
      <div className="votar-container-2">
        <button className="button-close" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="close"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="title-enquete">Detalhes da Enquete</h2>
        <div className="mb-4">
          <p className="font-semibold marginp">Título:</p>
          <p>{data.titulo}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold marginp">Data de Início:</p>
          <p>{formatDate(data.data_inicio)}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold marginp">Data de Término:</p>
          <p>{formatDate(data.data_termino)}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold marginp">Opções:</p>
          {data.opcoes.map((opcao, index) => (
            <div key={index} className="opcoes-votar">
              <button
                className="button-votar"
                onClick={() => handleVotos(opcao)}
                disabled={dataVoto}
              >
                {loadingVoto ? 'Votando...' : `Votar em ${opcao.opcao}`}
              </button>
            </div>
          ))}
          <button
            className="edit-button"
            onClick={handleEdit}
            disabled={loading}
          >{loading ? 'Editando...' : 'Editar Enquete'}
          </button>
          {showFormEdit && (
        <div className="flex-edit">
          <div className="edit-container">
            <FormularioEdicao  onClose={handleCloseFormEdit} id={id}/>
          </div>
        </div>
      )}
          <button
            className="delete-button"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deletando...' : 'Deletar Enquete'}
          </button>
        </div>
      </div>
    </div>
  )
}
