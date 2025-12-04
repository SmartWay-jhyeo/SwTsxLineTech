"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "로그인 중..." : "로그인"}
    </Button>
  );
}

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function clientAction(formData: FormData) {
    const result = await login(formData);
    if (result?.error) {
      setErrorMessage(result.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">관리자 로그인</h1>
          <p className="text-sm text-gray-500 mt-2">
            라인테크 관리자 계정으로 로그인하세요
          </p>
        </div>

        <form action={clientAction} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm text-center font-medium">
              {errorMessage}
            </div>
          )}

          <LoginButton />
        </form>
      </div>
    </div>
  );
}
