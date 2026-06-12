import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Lock } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';

// Firebase handles password reset via email link — the reset flow happens on 
// Firebase's own hosted page. This page shows a confirmation message.
export default function ResetPassword() {
  return (
    <AuthLayout
      icon={Lock}
      title="Redefinição de senha"
      subtitle="Verifique seu email"
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline">
          Voltar para login
        </Link>
      }
    >
      <p className="text-sm text-foreground text-center">
        Um email de redefinição de senha foi enviado. Clique no link do email para definir sua nova senha.
      </p>
    </AuthLayout>
  );
}
