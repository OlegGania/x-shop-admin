import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { type Locator, userEvent } from 'vitest/browser'
import { UserAuthForm } from './user-auth-form'

const FORM_MESSAGES = {
  emailEmpty: 'Please enter your email.',
  passwordEmpty: 'Please enter your password.',
  passwordShort: 'Password must be at least 6 characters long.',
} as const

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  single: vi.fn(),
  from: vi.fn(),
}))

vi.mock('@/shared/api/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: mocks.signInWithPassword,
      signOut: mocks.signOut,
    },
    from: mocks.from,
  },
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()

  return {
    ...actual,
    useNavigate: () => mocks.navigate,
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

function mockAdminLoginSuccess() {
  mocks.signInWithPassword.mockResolvedValue({
    data: {
      user: {
        id: 'admin-user-id',
        email: 'admin@gmail.com',
      },
    },
    error: null,
  })

  mocks.single.mockResolvedValue({
    data: {
      role: 'admin',
    },
    error: null,
  })
}

function mockCustomerLoginSuccess() {
  mocks.signInWithPassword.mockResolvedValue({
    data: {
      user: {
        id: 'customer-user-id',
        email: 'customer@gmail.com',
      },
    },
    error: null,
  })

  mocks.single.mockResolvedValue({
    data: {
      role: 'customer',
    },
    error: null,
  })
}

describe('UserAuthForm', () => {
  describe('Rendering without redirectTo', () => {
    let screen: RenderResult
    let emailInput: Locator
    let passwordInput: Locator
    let signInButton: Locator
    let forgotPasswordLink: Locator

    beforeEach(async () => {
      vi.clearAllMocks()

      mocks.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: mocks.single,
          })),
        })),
      })

      mockAdminLoginSuccess()

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
        expect(mocks.signInWithPassword).toHaveBeenCalledWith({
          email: 'admin@gmail.com',
          password: '123456',
        })
      )

      await vi.waitFor(() =>
        expect(mocks.navigate).toHaveBeenCalledWith({
          to: '/',
          replace: true,
        })
      )
    })
  })

  it('navigates to redirectTo when provided', async () => {
    vi.clearAllMocks()

    mocks.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: mocks.single,
        })),
      })),
    })

    mockAdminLoginSuccess()

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
      expect(mocks.navigate).toHaveBeenCalledWith({
        to: '/settings',
        replace: true,
      })
    )
  })

  it('signs out and does not navigate when user is not admin', async () => {
    vi.clearAllMocks()

    mocks.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: mocks.single,
        })),
      })),
    })

    mockCustomerLoginSuccess()

    const { getByRole, getByLabelText } = await render(<UserAuthForm />)

    await userEvent.fill(
      getByRole('textbox', { name: /Email/i }),
      'customer@gmail.com'
    )
    await userEvent.fill(getByLabelText('Password'), '123456')

    await userEvent.click(getByRole('button', { name: /Sign in/i }))

    await vi.waitFor(() => expect(mocks.signOut).toHaveBeenCalledOnce())
    expect(mocks.navigate).not.toHaveBeenCalled()
  })
})
