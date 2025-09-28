import { useMutation } from '@tanstack/react-query'
import { createItem } from '../lib/api'
import { useState } from 'react'
import { TextSchema } from '../lib/validate'

export function AddItem({ onAdded }: { onAdded: () => void }) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      setText('')
      setError(null)
      onAdded()
    },
    onError: () => {
      setError("Failed to create item")
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const validText = TextSchema.parse(text)
      mutation.mutate(validText)
    } catch (err: any) {
      if (err.issues) {
        setError(err.issues[0].message)
      } else {
        setError(err.message)
      }
      return
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your item"
        style={{ flex: 1, padding: '0.5rem' }}
      />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Adding…' : 'Add'}
      </button>
      {error && <p style={{ color: 'red', marginLeft: 8 }}>{error}</p>}
    </form>
  )
}
