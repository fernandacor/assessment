"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      return;
    }

    // → Aquí: llamamos a la ruta interna de Next
    const res = await fetch("/api/front/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formValues.email,
        password: formValues.password,
        confirmPassword: formValues.confirmPassword,
        username: formValues.username,
      }),
    });

    if (res.ok) {
      setError("");
      // Si el registro fue exitoso, redirigimos al login
      router.push("/signin");
      router.refresh();
    } else {
      const data = await res.json();
      if (res.status === 409 && data.error === "El usuario ya existe.") {
        setError("Ya existe un usuario con ese email.");
      } else if (res.status === 400 && data.error) {
        setError(data.error);
      } else {
        setError(
          "Ocurrió un error al procesar el registro. Intenta más tarde."
        );
      }
    }
  };

  return (
    <form
      className="group space-y-6"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* --- Email --- */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-black"
        >
          Correo Electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formValues.email}
          onChange={(e) =>
            setFormValues({ ...formValues, email: e.target.value })
          }
          className="block w-full px-3 py-2 mt-2 border rounded-md text-black bg-neutral-100/50"
        />
      </div>

        {/* --- username --- */}
        <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium leading-6 text-black"
        >
          Usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          value={formValues.username}
          onChange={(e) =>
            setFormValues({ ...formValues, username: e.target.value })
          }
          className="block w-full px-3 py-2 mt-2 border rounded-md text-black bg-neutral-100/50"
        />
      </div>

      {/* --- Password --- */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-black"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formValues.password}
          onChange={(e) =>
            setFormValues({ ...formValues, password: e.target.value })
          }
          className="block w-full px-3 py-2 mt-2 border rounded-md text-black bg-neutral-100/50"
        />
      </div>

      {/* --- Confirm Password --- */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium leading-6 text-black"
        >
          Confirmar Contraseña
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formValues.confirmPassword}
          onChange={(e) =>
            setFormValues({
              ...formValues,
              confirmPassword: e.target.value,
            })
          }
          className="block w-full px-3 py-2 mt-2 border rounded-md text-black bg-neutral-100/50"
        />
      </div>

      {/* --- Error --- */}
      {error && (
        <div className="mt-4 text-sm text-red-500">{error}</div>
      )}

      {/* --- Submit Button --- */}
      <button
        type="submit"
        className="flex w-full justify-center rounded-md bg-[#355C7D] px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-[#C5CAE9] hover:text-[#253c51] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Registrarme
      </button>
    </form>
  );
}
