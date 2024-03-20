'use client'
import FormularioCriacao from '@/components/create-form'
import FormularioExibicao from '@/components/form'
import { useEffect, useState } from 'react'
import css from './page.css'
export default function Home() {
  const [data, setData] = useState([])
  const [votos, setVotos] = useState([])
  const fetchData = async () => {
    try {
      const response = await fetch('https://form-node-sql.onrender.com/form')
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    }
  }

  const fetchVotos = async () => {
    try {
      const response = await fetch('https://form-node-sql.onrender.com/votos')
      const data = await response.json()
      setVotos(data)
    } catch (error) {
      console.error('Erro ao buscar votos:', error)
    }
  }
  useEffect(() => {
    const handleFormSubmitted = async () => {
      await fetchData()
      await fetchVotos()
    }

    fetchData()
    fetchVotos()

    document.addEventListener('formSubmitted', handleFormSubmitted)
    return () => {
      document.removeEventListener('formSubmitted', handleFormSubmitted)
    }
  }, [])
  return (
    <div className="container">
      <div className="horizontal-line" />
      <div className="grid">
        <FormularioCriacao />
        {data.map((form, index) => (
          <FormularioExibicao
            key={index}
            data={form}
            id={form.id}
            votos={votos.filter((voto) =>
              form.opcoes.map((opcao) => opcao.id === voto.opcao_id),
            )}
          />
        ))}
      </div>
      <div className="horizontal-line" />
    </div>
  )
}
