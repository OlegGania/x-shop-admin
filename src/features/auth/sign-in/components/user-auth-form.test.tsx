import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { type Locator, userEvent } from 'vitest/browser'
import { UserAuthForm } from './user-auth-form'

const FORM_MESSAGES = {
  emailEmpty: 'Please enter your email.',
  passwordEmpty: 'Please enter your password.',
  passwordShort: 'Password must be at least 6 characters long.',
} as const

const navigate = vi.fn()
const signInWithPasswordMock = vi.fn()
const signOutMock = vi.fn()
const singleMock = vi.fn()

vi.mock('@/shared/api/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: signInWithPasswordMock,
      signOut: signOutMock,
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: singleMock,
        })),
      })),
    })),
  },
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useNavigate: () => navigate,
    Link: ({
      children,
      to,
      className,
      ...rest
    }: {
      children?: React.ReactNode
      to: string
      className?: string
    }) => (
      <a href={to} className={className} {...rest}>
        {children}
      </a>
    ),
  }
})

describe('UserAuthForm', () => {
  describe('Rendering without redirectTo', () => {
    let screen: RenderResult
    let emailInput: Locator
    let passwordInput: Locator
    let signInButton: Locator
    let forgotPasswordLink: Locator

    beforeEach(async () => {
      vi.clearAllMocks()

      signInWithPasswordMock.mockResolvedValue({
        data: {
          user: {
            id: 'admin-user-id',
            email: 'admin@gmail.com',
          },
        },
        error: null,
      })

      singleMock.mockResolvedValue({
        data: {
          role: 'admin',
        },
        error: null,
      })

      screen = await render(<UserAuthForm />)
      emailInput = screen.getByRole('textbox', { name: /^Email$/i })
      passwordInput = screen.getByLabelText(/^Password$/i)
      signInButton = screen.getByRole('button', { name: /^Sign in$/i })
      forgotPasswordLink = screen.getByText(/^Forgot password\?$/i)
    })

    it('renders fields, submit button, and forgot password link', async () => {
      await expect.element(emailInput).toBeInTheDocument()
      await expect.element(passwordInput).toBeInTheDocument()
      await expect.element(signInButton).toBeInTheDocument()
      await expect.element(forgotPasswordLink).toBeInTheDocument()
    })

    it('shows validation messages when submitting empty form', async () => {
      await userEvent.click(signInButton)

      await expect
        .element(screen.getByText(FORM_MESSAGES.emailEmpty))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText(FORM_MESSAGES.passwordEmpty))
        .toBeInTheDocument()
    })

    it('authenticates admin and navigates to default route on success', async () => {
      await userEvent.fill(emailInput, 'admin@gmail.com')
      await userEvent.fill(passwordInput, '123456')

      await userEvent.click(signInButton)

      await vi.waitFor(() =>
        expect(signInWithPasswordMock).toHaveBeenCalledWith({
          email: 'admin@gmail.com',
          password: '123456',
        })
      )

      await vi.waitFor(() =>
        expect(navigate).toHaveBeenCalledWith({ to: '/', replace: true })
      )
    })
  })

  it('navigates to redirectTo when provided', async () => {
    vi.clearAllMocks()

    signInWithPasswordMock.mockResolvedValue({
      data: {
        user: {
          id: 'admin-user-id',
          email: 'admin@gmail.com',
        },
      },
      error: null,
    })

    singleMock.mockResolvedValue({
      data: {
        role: 'admin',
      },
      error: null,
    })

    const { getByRole, getByLabelText } = await render(
      <UserAuthForm redirectTo='/settings' />
    )

    await userEvent.fill(
      getByRole('textbox', { name: /Email/i }),
      'admin@gmail.com'
    )
    await userEvent.fill(getByLabelText('Password'), '123456')

    await userEvent.click(getByRole('button', { name: /Sign in/i }))

    await vi.waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({
        to: '/settings',
        replace: true,
      })
    )
  })

  it('signs out and does not navigate when user is not admin', async () => {
    vi.clearAllMocks()

    signInWithPasswordMock.mockResolvedValue({
      data: {
        user: {
          id: 'customer-user-id',
          email: 'customer@gmail.com',
        },
      },
      error: null,
    })

    singleMock.mockResolvedValue({
      data: {
        role: 'customer',
      },
      error: null,
    })

    const { getByRole, getByLabelText } = await render(<UserAuthForm />)

    await userEvent.fill(
      getByRole('textbox', { name: /Email/i }),
      'customer@gmail.com'
    )
    await userEvent.fill(getByLabelText('Password'), '123456')

    await userEvent.click(getByRole('button', { name: /Sign in/i }))

    await vi.waitFor(() => expect(signOutMock).toHaveBeenCalledOnce())
    expect(navigate).not.toHaveBeenCalled()
  })
})
