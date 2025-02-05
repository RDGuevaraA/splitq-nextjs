"use client"
import { MdOutlineLogout, MdOutlineSettings } from "react-icons/md";
import IconBox from "../ui/IconBox";
import { logout } from "@/actions/logout";
import { Button } from "../ui/button";
import { useTransition, animated } from "@react-spring/web";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

export default function SettingButtonUser({ user }) {
    const [menuSetting, setMenuSetting] = useState(false);
    const [bgMenu, setbgMenu] = useState(false);

    const bgTransition = useTransition(bgMenu, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: {duration: 50}

    });

    const transitionsMenu = useTransition(menuSetting, {
        from: { translateX: "100%" },
        enter: { translateX: "0%" },
        leave: { translateX: "100%" },
        config: {duration: 120}

    });

    const toggleView = () => {
        setMenuSetting(!menuSetting)
        setbgMenu(!bgMenu)
    }

    return (
        <>
            <div onClick={toggleView}>
                <IconBox variant={"square"} Icon={MdOutlineSettings} />
            </div>

            {bgTransition((style,item) => (item ? (
                <animated.div style={style} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-10">
                    {transitionsMenu((style, item) => item ? <SideMenu user={user} close={toggleView} style={style} /> : "")}
                </animated.div>
            ) : ""))}
        </>
    )
}


function SideMenu({ style, user, close }) {
    const ref = useRef();
    useOnClickOutside(ref, close);
    return (
        <animated.div ref={ref} style={style} className="text-right overflow-scroll bg-foreground border-l border-border max-h-[100svh] h-screen absolute right-0 grid grid-rows-[min-content_1fr]">
            <div className="">
                <h2 className="font-bold p-4 text-xl">{user.name} {user.lastname}</h2>
                <div>
                    <h3 className="text-text-secundary p-4 pb-2 font-bold text-lg">Cuenta</h3>
                    <div className="border-t border-border border-b p-4">
                        <p className="font-bold">Configuracion de cuenta</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-text-secundary p-4 pb-2 font-bold text-lg">Historial</h3>
                    <div className="border-t border-border border-b p-4">
                        <p className="font-bold">Historial de acciones</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-text-secundary p-4 pb-2 font-bold text-lg">Rembolsos</h3>
                    <div className="border-t border-border border-b p-4">
                        <p className="font-bold">Crear Rembolsos</p>
                    </div>
                    <div className="border-border border-b p-4">
                        <p className="font-bold">Mis Rembolsos</p>
                    </div>
                </div>


            </div>


            <form className="p-4 grid items-end" action={logout}>
                <Button className="w-full flex items-center gap-2">
                    <MdOutlineLogout size={20} />
                    <p>Cerrar Sesion</p>
                </Button>
            </form>


        </animated.div>
    )
}