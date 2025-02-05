"use client"
import { createUser } from "@/actions/createUser";
import Loader from "@/components/Loader";
import FormInput from "@/components/form/FormInput";
import AlertWarning from "@/components/ui/AlertWarning";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineWarningAmber } from "react-icons/md";
import FormLayout from "../layout";

export default function SignUp() {
    const [warning, setWarning] = useState(false)
    const [loading, startTransition] = useTransition();
    const [succes, setSucces] = useState(false);
    const { register, handleSubmit, formState, } = useForm({
        defaultValues: {
            name: "",
            lastname: "",
            email: "",
            password: ""
        }
    });

    const signup = (data) => {
        setWarning(false)
        startTransition(async () => {
            data.email = data.email.toLowerCase().trim();
            const result = await createUser(data);
            if (result) {
                setWarning(result.error)
            }

            if (!result?.error) {
                setSucces(true)

            }
        })

    }

    if (succes) return (
        <div className="backdrop-blur-sm p-4 fixed inset-0 gap-4 flex flex-col">
            <div className="bg-foreground p-4 gap-3 border border-border rounded-md flex flex-col">
                <h1 className="text-xl font-bold text-center">Verifica tu cuenta</h1>
                <p className="text-md text-text-secundary text-center mb-5">En tu correo se ha enviado un codigo de verificacion!</p>
                <AlertWarning
                    title={"Advertencia"}
                    description={"Necesitaras conexion a internet o datos moviles"}
                />
                <FormInput
                    label={"Codigo de verificacion"}
                    placeholder={"Codigo de verificacion"}
                />
            </div>
        </div>
    )

    return (
        <>
            <form noValidate onSubmit={handleSubmit(signup)} className='flex flex-col gap-4'>
                <div>
                    <h1 className='font-bold text-2xl '>Crear Cuenta</h1>
                    <p className='text-gray-400'>Crea una nueva cuenta en SplitQ</p>
                </div>
                {warning && <AlertWarning
                    title={"Advertencia"}
                    description={warning}
                />}
                <FormInput
                    label={"Nombre"}
                    placeholder={"Nombre"}
                    type={"text"}
                    register={register("name", { required: { value: true, message: "Nombre esta vacio" } })}
                    error={formState.errors.name?.message}
                />
                <FormInput
                    label={"Apellido"}
                    placeholder={"Apellido"}
                    type={"text"}
                    register={register("lastname", { required: { value: true, message: "Apellido esta vacio" } })}
                    error={formState.errors.lastname?.message}
                />

                <FormInput
                    label={"Email"}
                    placeholder={"Email"}
                    type={"text"}
                    register={register("email", { required: { value: true, message: "Email esta vacio" }, pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Debe ser un correo valido" } })}
                    error={formState.errors.email?.message}
                />
                <FormInput
                    label={"Contraseña"}
                    placeholder={"Contraseña"}
                    type={"password"}
                    register={register("password", { required: { value: true, message: "Contraseña esta vacia" }, minLength: { value: 8, message: "Minimo 8 caracteres" } })}
                    error={formState.errors.password?.message}
                />
                <div className="flex flex-col">
                    <Button disabled={loading} type="submit" className="font-bold">
                        {loading ? <Loader /> : "Crear Cuenta"}
                    </Button>
                    <Link className=" text-text-secundary underline  text-center mt-2" href={"/auth/login"}>¿Ya tienes cuenta? Inicia Sesion</Link>
                </div>
            </form>


        </>
    )
}





