import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '../contact-form'

// Mock global fetch
global.fetch = jest.fn()

describe('ContactForm - Test 6: Gestion d\'erreur API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  // Helper function pour remplir le formulaire avec des données valides
  const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByLabelText(/nom complet/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Test message de plus de 10 caractères')
  }

  describe('API Error Responses', () => {
    it('handles validation error from API (400)', async () => {
      const user = userEvent.setup()
      
      // Mock erreur de validation Zod
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ 
          success: false, 
          message: "Données invalides",
          errors: [
            {
              code: "too_small",
              minimum: 2,
              type: "string",
              inclusive: true,
              exact: false,
              message: "Le nom doit contenir au moins 2 caractères",
              path: ["name"]
            }
          ]
        })
      })
      
      render(<ContactForm />)
      
      // Remplir avec des données qui causeront une erreur de validation
      await user.type(screen.getByLabelText(/nom complet/i), 'J') // Nom trop court
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/message/i), 'Test message de plus de 10 caractères')
      
      const submitButton = screen.getByRole('button', { name: /envoyer ma demande/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/données invalides/i)).toBeInTheDocument()
      })
      
      // Vérifier que le message d'erreur est affiché avec le style d'erreur
      const errorMessage = screen.getByText(/données invalides/i)
      expect(errorMessage.closest('div')).toHaveClass('bg-red-500/20', 'border-red-500', 'text-red-400')
      
      // Vérifier l'icône d'erreur
      expect(screen.getByText('❌')).toBeInTheDocument()
    })

    it('handles server error (500)', async () => {
      const user = userEvent.setup()
      
      // Mock erreur serveur
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ 
          success: false, 
          message: "Une erreur est survenue. Veuillez réessayer." 
        })
      })
      
      render(<ContactForm />)
      
      await fillValidForm(user)
      await user.click(screen.getByRole('button', { name: /envoyer ma demande/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/une erreur est survenue/i)).toBeInTheDocument()
      })
      
      // Vérifier que l'API a été appelée avec les bonnes données
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          company: '',
          phone: '',
          service: undefined,
          message: 'Test message de plus de 10 caractères'
        })
      })
    })

    it('handles email validation error', async () => {
      const user = userEvent.setup()
      
      // Mock erreur de validation email
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ 
          success: false, 
          message: "Données invalides",
          errors: [
            {
              validation: "email",
              code: "invalid_string",
              message: "Email invalide",
              path: ["email"]
            }
          ]
        })
      })
      
      render(<ContactForm />)
      
      await user.type(screen.getByLabelText(/nom complet/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'email-invalide') // Email invalide
      await user.type(screen.getByLabelText(/message/i), 'Test message de plus de 10 caractères')
      
      await user.click(screen.getByRole('button', { name: /envoyer ma demande/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/données invalides/i)).toBeInTheDocument()
      })
    })

    it('handles message too short error', async () => {
      const user = userEvent.setup()
      
      // Mock erreur message trop court
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ 
          success: false, 
          message: "Données invalides",
          errors: [
            {
              code: "too_small",
              minimum: 10,
              type: "string",
              inclusive: true,
              exact: false,
              message: "Le message doit contenir au moins 10 caractères",
              path: ["message"]
            }
          ]
        })
      })
      
      render(<ContactForm />)
      
      await user.type(screen.getByLabelText(/nom complet/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/message/i), 'Court') // Message trop court
      
      await user.click(screen.getByRole('button', { name: /envoyer ma demande/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/données invalides/i)).toBeInTheDocument()
      })
    })

    it('handles API response with success: false but no specific error message', async () => {
      const user = userEvent.setup()
      
      // Mock réponse API avec success: false mais sans message spécifique
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true, // HTTP 200 mais success: false dans le JSON
        status: 200,
        json: async () => ({ 
          success: false
          // Pas de message spécifique
        })
      })
      
      render(<ContactForm />)
      
      await fillValidForm(user)
      await user.click(screen.getByRole('button', { name: /envoyer ma demande/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/une erreur est survenue/i)).toBeInTheDocument()
      })
    })

    it('clears error message when user starts typing again', async () => {
      const user = userEvent.setup()
      
      // Premier appel avec erreur
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ 
          success: false, 
          message: "Données invalides"
        })
      })
      
      render(<ContactForm />)
      
      await fillValidForm(user)
      await user.click(screen.getByRole('button', { name: /envoyer ma demande/i }))
      
      // Attendre que l'erreur s'affiche
      await waitFor(() => {
        expect(screen.getByText(/données invalides/i)).toBeInTheDocument()
      })
      
      // Commencer à taper dans un champ
      await user.type(screen.getByLabelText(/nom complet/i), ' Updated')
      
      // L'erreur devrait disparaître
      await waitFor(() => {
        expect(screen.queryByText(/données invalides/i)).not.toBeInTheDocument()
      })
    })

    it('maintains form data after API error', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ 
          success: false, 
          message: "Erreur serveur"
        })
      })
      
      render(<ContactForm />)
      
      const nameInput = screen.getByLabelText(/nom complet/i)
      const emailInput = screen.getByLabelText(/email/i)
      const messageInput = screen.getByLabelText(/message/i)
      
      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(messageInput, 'Test message de plus de 10 caractères')
      
      await user.click(screen.getByRole('button', { name: /envoyer ma demande/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/erreur serveur/i)).toBeInTheDocument()
      })
      
      // Les données du formulaire doivent être préservées
      expect(nameInput).toHaveValue('John Doe')
      expect(emailInput).toHaveValue('john@example.com')
      expect(messageInput).toHaveValue('Test message de plus de 10 caractères')
    })

    it('re-enables submit button after error', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ 
          success: false, 
          message: "Erreur serveur"
        })
      })
      
      render(<ContactForm />)
      
      await fillValidForm(user)
      
      const submitButton = screen.getByRole('button', { name: /envoyer ma demande/i })
      await user.click(submitButton)
      
      // Pendant la soumission, le bouton est désactivé
      expect(submitButton).toBeDisabled()
      
      // Après l'erreur, le bouton doit être réactivé
      await waitFor(() => {
        expect(screen.getByText(/erreur serveur/i)).toBeInTheDocument()
      })
      
      expect(submitButton).not.toBeDisabled()
      expect(submitButton).toHaveTextContent(/envoyer ma demande/i)
    })

    it('handles service selection with error', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ 
          success: false, 
          message: "Service non valide"
        })
      })
      
      render(<ContactForm defaultService="SOC" />)
      
      await user.type(screen.getByLabelText(/nom complet/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/message/i), 'Test message SOC')
      
      await user.click(screen.getByRole('button', { name: /envoyer ma demande/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/service non valide/i)).toBeInTheDocument()
      })
      
      // Vérifier que l'API a été appelée avec le service par défaut
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          company: '',
          phone: '',
          service: 'SOC',
          message: 'Test message SOC'
        })
      })
    })
  })
})
