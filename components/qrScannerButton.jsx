"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "./ui/button"
import { animated, useSpring, useTransition } from "@react-spring/web";
import QrScanner from "qr-scanner";
import Loader from "./Loader";
import IconBox from "./ui/IconBox";
import { MdOutlineArrowBack } from "react-icons/md";
import { cn } from "@/lib/utils";
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle} from "./ui/dialog";

export default function QrScannerButton({ children, onValue = () => { } }) {
    const [modal, setModal] = useState(false);
    const [qrReader, setQrReader] = useState()
    const [loadingQRCAM, startQRCAM] = React.useTransition();
    const [loadingCams, startCamList] = React.useTransition();
    const [qrEnabled, setQREnabled] = useState(false);

    const [errorCAM, setErrorCAM] = useState();

    const ref = useRef();


    const transitionQR = useTransition(modal, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 150 }
    });


    const toggleModal = () => {
        setModal(!modal)
    }

    const startQRScanning = (qrInstance) => {
        startQRCAM(async () => {
            await qrInstance.start();
            setQREnabled(true)
        })
    }

    const stopQRScanning = () => {
        qrReader.stop();
        setQREnabled(false)
        toggleModal()
    }

    const openModal = () => {
        startCamList(async () => {
            const cameras = await QrScanner.listCameras();
            if (!cameras.length) {
                setErrorCAM(true);
                return;
            }

            toggleModal();
        })

    }

    useEffect(() => {

        if (modal && !qrReader) {
            const qrReaderInstance = new QrScanner(ref.current, onValue , { returnDetailedScanResult: true, highlightScanRegion: true, });
            startQRScanning(qrReaderInstance)
            setQrReader(qrReaderInstance)
        }

        if (modal && qrReader) {
            startQRScanning(qrReader)
        }


    }, [modal])

    return (
        <>
            <Dialog open={errorCAM} onOpenChange={setErrorCAM}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>No hay camaras disponibles</DialogTitle>
                        <DialogDescription>SplitQ no tiene acceso a las camaras de tu dipositivo</DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <Button disabled={loadingCams} onClick={openModal}>{children}</Button>
            {transitionQR((style, item) => item ? (
                <animated.div className={"bg-background flex justify-center  items-center inset-0 fixed z-10"} style={style}>
                    {loadingQRCAM && <Loader invert />}

                </animated.div>
            ) : "")
            }

            <div className={cn(modal ? "z-10" : "-z-10", "flex justify-center fixed  top-0 left-0 right-0")}>
                <video ref={ref} id="qr-reader">
                </video>
            </div>

            {qrEnabled && <IconBox onClick={stopQRScanning} variant={"square"} className={"fixed z-10 top-4 left-4"} Icon={MdOutlineArrowBack} />}
        </>
    )
}