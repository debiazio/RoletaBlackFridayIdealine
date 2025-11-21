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

  const [errors, setErrors] = useState({
    nome: '',
    email: '',
    telefone: '',
    aceitarComunicacao: '',
    aceitarPrivacidade: ''
  })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

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

  // =====================================================================
  // VALIDAÇÃO POR BLUR (MOSTRA ERROS)
  // =====================================================================
  const handleBlur = (e: any) => {
    const { name, value } = e.target
    let msg = ''

    switch (name) {
      case 'nome':
        if (!value.trim()) msg = 'O nome é obrigatório.'
        else if (/\d/.test(value)) msg = 'O nome não pode conter números.'
        break

      case 'email':
        if (!value.trim()) msg = 'O e-mail é obrigatório.'
        else if (!emailRegex.test(value))
          msg = 'Digite um e-mail válido.'
        break

      case 'telefone':
        const numbers = value.replace(/\D/g, '')
        if (numbers.length < 11) msg = 'Digite um telefone válido.'
        break

      case 'aceitarComunicacao':
        if (!form.aceitarComunicacao)
          msg = 'É necessário aceitar comunicações.'
        break

      case 'aceitarPrivacidade':
        if (!form.aceitarPrivacidade)
          msg = 'É necessário aceitar a política de privacidade.'
        break
    }

    setErrors(prev => ({ ...prev, [name]: msg }))
  }

  // =====================================================================
  // silentValidate → habilita botão
  // =====================================================================
  const silentValidate = () => {
    const phone = form.telefone.replace(/\D/g, '')

    const nomeValido = form.nome.trim() && !/\d/.test(form.nome)
    const emailValido = emailRegex.test(form.email)

    return (
      nomeValido &&
      emailValido &&
      phone.length >= 11 &&
      form.aceitarComunicacao &&
      form.aceitarPrivacidade
    )
  }

  // =====================================================================
  // SUBMIT
  // =====================================================================
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!silentValidate()) {
      Object.keys(form).forEach(field => {
        handleBlur({ target: { name: field, value: (form as any)[field] } })
      })
      return
    }

    setLoading(true)
    setSuccess(false)

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
        window.dispatchEvent(new Event('form-roleta-sucesso'))

        setForm({
          nome: '',
          email: '',
          telefone: '',
          aceitarComunicacao: false,
          aceitarPrivacidade: false
        })

        setErrors({
          nome: '',
          email: '',
          telefone: '',
          aceitarComunicacao: '',
          aceitarPrivacidade: ''
        })
      } else {
        alert('Erro ao enviar os dados.')
      }
    } catch {
      alert('Erro de conexão.')
    }

    setLoading(false)
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>

        <input
          type="text"
          className={styles.formInput}
          placeholder="Digite seu nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.nome && <p className={styles.errorMessage}>{errors.nome}</p>}

        <input
          type="email"
          className={styles.formInput}
          placeholder="Digite seu email"
          name="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
        />
        {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}

        <input
          type="text"
          className={styles.formInput}
          placeholder="Digite seu celular"
          name="telefone"
          maxLength={15}
          value={form.telefone}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.telefone && <p className={styles.errorMessage}>{errors.telefone}</p>}

        <label className={styles.formCheckbox}>
          <input
            type="checkbox"
            name="aceitarComunicacao"
            checked={form.aceitarComunicacao}
            onChange={handleChange}
            onBlur={handleBlur}
            className={styles.checkboxHidden}
          />
          <span className={styles.customCheckbox}></span>
          Eu concordo em receber comunicações.
        </label>
        {errors.aceitarComunicacao && (
          <p className={styles.errorMessage}>{errors.aceitarComunicacao}</p>
        )}

        <label className={styles.formCheckbox}>
          <input
            type="checkbox"
            name="aceitarPrivacidade"
            checked={form.aceitarPrivacidade}
            onChange={handleChange}
            onBlur={handleBlur}
            className={styles.checkboxHidden}
          />
          <span className={styles.customCheckbox}></span>
          <span>
            Li e aceito os termos de
            <a
              href="https://www.madumfm.com.br/politica-de-privacidade"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.privacyLink}
            >
              &nbsp;política de privacidade.
            </a>
          </span>
        </label>
        {errors.aceitarPrivacidade && (
          <p className={styles.errorMessage}>{errors.aceitarPrivacidade}</p>
        )}

        <button
          className={styles.formButton}
          disabled={loading || !silentValidate()}
        >
          {loading ? 'Enviando...' : 'ENVIAR'}
        </button>

        {success && (
          <p className={styles.successMessage}>Enviado com sucesso!</p>
        )}

      </form>
    </div>
  )
}

export default ContactForm
