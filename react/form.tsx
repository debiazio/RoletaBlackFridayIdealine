import React, { useState } from 'react'
import styles from './styles.css'

const ContactForm: React.FC = () => {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    aceitarComunicacao: false,
    aceitarPrivacidade: false
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target

    if (name === 'telefone') {
      setForm({ ...form, telefone: formatPhone(value) })
      return
    }

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const validate = () => {
    if (!form.nome.trim()) return false
    if (!form.email.includes('@')) return false
    if (form.telefone.replace(/\D/g, '').length < 11) return false
    if (!form.aceitarComunicacao) return false
    if (!form.aceitarPrivacidade) return false
    return true
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!validate()) {
      setError(true)
      return
    }

    setLoading(true)
    setSuccess(false)
    setError(false)

    try {
      const res = await fetch('/api/dataentities/CO/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          telefone: form.telefone
        })
      })

      if (res.ok) {
        setSuccess(true)
        window.dispatchEvent(new Event("form-roleta-sucesso"))

        setForm({
          nome: '',
          email: '',
          telefone: '',
          aceitarComunicacao: false,
          aceitarPrivacidade: false
        })
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    }

    setLoading(false)
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>

        <input
          type="text"
          className={styles.formInput}
          placeholder="Digite seu nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
        />

        <input
          type="email"
          className={styles.formInput}
          placeholder="Digite seu email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="text"
          className={styles.formInput}
          placeholder="Digite seu celular"
          name="telefone"
          maxLength={15}
          value={form.telefone}
          onChange={handleChange}
        />

        <label className={styles.formCheckbox}>
          <input
            type="checkbox"
            name="aceitarComunicacao"
            checked={form.aceitarComunicacao}
            onChange={handleChange}
            className={styles.checkboxHidden}
          />
          <span className={styles.customCheckbox}></span>
          Eu concordo em receber comunicações.
        </label>

        <label className={styles.formCheckbox}>
          <input
            type="checkbox"
            name="aceitarPrivacidade"
            checked={form.aceitarPrivacidade}
            onChange={handleChange}
            className={styles.checkboxHidden}
          />
          <span className={styles.customCheckbox}></span>

          <span>
            Li e aceito os termos de
            <a
              href="https://www.idealine.com.br/institucional/politica-privacidade"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.privacyLink}
            >
              &nbsp;política de privacidade.
            </a>
          </span>
        </label>


        <button className={styles.formButton} disabled={loading}>
          {loading ? 'Enviando...' : 'ENVIAR'}
        </button>

        {success && (
          <p className={styles.successMessage}>
            Enviado com sucesso!
          </p>
        )}

        {error && (
          <p className={styles.errorMessage}>
            Há itens não preenchidos/marcados.
          </p>
        )}
      </form>
    </div>
  )
}

export default ContactForm
