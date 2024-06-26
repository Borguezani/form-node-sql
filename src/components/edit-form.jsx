'use client'
import css from './create-form.css'
import { useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
const FormularioEdicao = ({onClose ,id}) => {
  const [titulo, setTitulo] = useState('')
  const [opcoes, setOpcoes] = useState(['', '', ''])
  const [dataInicio, setDataInicio] = useState('')
  const [dataTermino, setDataTermino] = useState('')
  const [loading, setLoading] = useState(false)
  const handleTituloChange = (e) => {
    setTitulo(e.target.value)
  }

  const handleOpcaoChange = (index, e) => {
    const novasOpcoes = [...opcoes]
    novasOpcoes[index] = e.target.value
    setOpcoes(novasOpcoes)
  }

  const handleDataInicioChange = (e) => {
    const dataInicioUTC = dayjs.utc(e.target.value).format('YYYY-MM-DDTHH:mm')
    setDataInicio(dataInicioUTC)
  }

  const handleDataTerminoChange = (e) => {
    const dataTerminoUTC = dayjs.utc(e.target.value).format('YYYY-MM-DDTHH:mm')
    setDataTermino(dataTerminoUTC)

  }

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    const formData = {
      title: titulo,
      field1: opcoes[0],
      field2: opcoes[1],
      field3: opcoes[2],
      data_inicio: dataInicio,
      data_termino: dataTermino,
    }

    await fetch(`https://form-node-sql.onrender.com/form/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    console.log('Título:', titulo)
    console.log('Opções:', opcoes)
    console.log('Data de Início:', dataInicio)
    console.log('Data de Término:', dataTermino)
    document.dispatchEvent(new Event('formSubmitted'))
    setLoading(false)
    onClose(false)
  }

  return (
    <div className="container-create">
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
      <h2 className="title-enquete">Editar Enquete</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="titulo" className="titulos">
            Título:
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={handleTituloChange}
            className="input"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="dataInicio"
            className="titulos"
          >
            Data de Início:
          </label>
          <input
            type="datetime-local"
            id="dataInicio"
            value={dataInicio}
            onChange={handleDataInicioChange}
            className="input"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="dataTermino"
            className="titulos"
          >
            Data de Término:
          </label>
          <input
            type="datetime-local"
            id="dataTermino"
            value={dataTermino}
            onChange={handleDataTerminoChange}
            className="input"
          />
        </div>
        {[1, 2, 3].map((i) => (
          <div className="mb-4" key={i}>
            <label
              htmlFor={`opcao${i}`}
              className="titulos"
            >
              Opção {i}:
            </label>
            <input
              type="text"
              id={`opcao${i}`}
              value={opcoes[i - 1]}
              onChange={(e) => handleOpcaoChange(i - 1, e)}
              className="input"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}

          className="submit-button"
        >
          {loading ? 'Editando Enquete...' : 'Editar Enquete'}
        </button>
      </form>
    </div>
  )
}

export default FormularioEdicao
