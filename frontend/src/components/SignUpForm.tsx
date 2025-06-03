"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname: string;
  address: string;
  birthdate: string;
}

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    address: "",
    birthdate: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      return;
    }

    // → Aquí: llamamos a la ruta interna de Next
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formValues.email,
        password: formValues.password,
        confirmPassword: formValues.confirmPassword,
        name: formValues.name,
        surname: formValues.surname,
        address: formValues.address,
        birthdate: formValues.birthdate,
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
          E-mail address
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
          className="block w-full px-3 py-2 mt-2 border rounded-md text-black"
        />
      </div>

      {/* --- Password --- */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-black"
        >
          Password
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
          className="block w-full px-3 py-2 mt-2 border rounded-md text-black"
        />
      </div>

      {/* --- Confirm Password --- */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium leading-6 text-black"
        >
          Confirm Password
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
          className="block w-full px-3 py-2 mt-2 border rounded-md text-black"
        />
      </div>

      {/* --- Name --- */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-black"
        >
          First Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formValues.name}
          onChange={(e) =>
            setFormValues({ ...formValues, name: e.target.value })
          }
          className="block w-full px-3 py-2 mt-2 border rounded-md text-black"
        />
      </div>

      {/* --- Surname --- */}
      <div>
        <label
          htmlFor="surname"
          className="block text-sm font-medium leading-6 text-black"
        >
          Last Name
        </label>
        <input
          id="surname"
          name="surname"
          type="text"
          required
          value={formValues.surname}
          onChange={(e) =>
            setFormValues({ ...formValues, surname: e.target.value })
          }
          className="block w-full px-3 py-2 mt-2 border rounded-md text-black"
        />
      </div>

      {/* --- Address --- */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium leading-6 text-black"
        >
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          required
          value={formValues.address}
          onChange={(e) =>
            setFormValues({ ...formValues, address: e.target.value })
          }
          className="block w-full px-3 py-2 mt-2 border rounded-md text-black"
        />
      </div>

      {/* --- Birthdate --- */}
      <div>
        <label
          htmlFor="birthdate"
          className="block text-sm font-medium leading-6 text-black"
        >
          Birthdate
        </label>
        <input
          id="birthdate"
          name="birthdate"
          type="date"
          required
          value={formValues.birthdate}
          onChange={(e) =>
            setFormValues({ ...formValues, birthdate: e.target.value })
          }
          className="block w-full px-3 py-2 mt-2 border rounded-md text-black"
        />
      </div>

      {/* --- Error --- */}
      {error && (
        <div className="mt-4 text-sm text-red-500">{error}</div>
      )}

      {/* --- Submit Button --- */}
      <button
        type="submit"
        className="block w-full px-4 py-2 mt-4 text-black bg-lighter rounded-md hover:bg-darkest"
      >
        Sign Up
      </button>
    </form>
  );
}
