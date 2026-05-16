import { createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/shared/api/supabaseClient'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

type Profile = {
  role: string | null
}

async function checkIsAdmin(userId: string) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single<Profile>()

  if (error) {
    return false
  }

  return profile.role === 'admin'
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }

    const isAdmin = await checkIsAdmin(session.user.id)

    if (!isAdmin) {
      await supabase.auth.signOut()

      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})
