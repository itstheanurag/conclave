"use client";
import React, { useState } from "react";
import LoginForm from "./forms/signin";
import SignupForm from "./forms/signup";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="space-y-6">
      {isLogin ? (
        <LoginForm onSwitch={() => setIsLogin(false)} />
      ) : (
        <SignupForm onSwitch={() => setIsLogin(true)} />
      )}
    </div>
  );
}
