'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { AlertCircle, ArrowLeft, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification link is invalid or has expired.',
  Default: 'An authentication error occurred.',
  CredentialsSignin: 'The email or password you entered is incorrect.',
}

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error') || 'Default'
  const message = errorMessages[error] || errorMessages.Default

  return (
    <Card className="w-full max-w-md border-border/50 shadow-2xl shadow-violet-500/5">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <Link href="/">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Activity className="w-6 h-6" />
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <CardTitle className="text-2xl text-center font-bold">Authentication Error</CardTitle>
        </div>
        <CardDescription className="text-center text-base">{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild className="w-full rounded-xl">
          <Link href="/auth/signin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-violet-50/30 to-indigo-50/30 dark:from-background dark:via-violet-950/10 dark:to-indigo-950/10 p-4">
      <Suspense fallback={<div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />}>
        <ErrorContent />
      </Suspense>
    </div>
  )
}
